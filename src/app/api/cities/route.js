import { z } from "zod";
import { NextResponse } from "next/server";
// Import ensureDbInitialized and AppDataSource from the central file
import { ensureDbInitialized, AppDataSource } from "../../database/data-source";
import { City } from "@/app/entity/City";
import { User } from "@/app/entity/User";
// REMOVE getServerSession and options imports
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

// Update citySchema to include the userId that will be sent in the body
const citySchema = z.object({
  // Add the user ID field expected from the frontend
  userId: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .refine((val) => !isNaN(val), {
      message: "User ID must be a valid number",
    }),
  name: z.string(),
  country: z.string(),
  countrycode: z.string().length(2),
  county: z.string().optional(),
  osm_type: z.string(),
  osm_id: z.number(),
  osm_key: z.string(),
  osm_value: z.string(),
  extent: z.array(z.number()).optional(),
  geometry: z.object({
    coordinates: z.array(z.number()),
  }),
  image: z.string().optional(),
});

export async function POST(req) {
  await ensureDbInitialized(); // Ensure DB is initialized
  const cityRepo = AppDataSource.getRepository(City);
  const userRepo = AppDataSource.getRepository(User);

  try {
    const data = await req.json();

    // REMOVE getServerSession call here
    // const session = await getServerSession(options);

    const parsedData = citySchema.safeParse(data);

    if (!parsedData.success) {
      console.error(
        "Validation errors in POST /api/cities:",
        parsedData.error.errors
      );
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsedData.error.errors,
        },
        { status: 400 }
      );
    }

    // Extract the userId directly from the validated data
    const {
      userId: dbUserId,
      users: payloadUsers = [],
      ...cityData
    } = parsedData.data;

    const userEntities = [];

    // --- Find the main user entity based on the userId provided in the body ---
    // This replaces the session user handling logic
    if (dbUserId) {
      console.log(
        `POST /api/cities: Attempting to find user by ID from body: ${dbUserId}`
      );
      const user = await userRepo.findOne({ where: { id: dbUserId } });

      if (user) {
        console.log(
          `POST /api/cities: Found user ${user.username} (ID: ${user.id}) from body userId.`
        );
        userEntities.push(user);
      } else {
        // If the user ID from the body doesn't match a user, it's an authentication/authorization failure.
        console.error(
          `POST /api/cities: User ID ${dbUserId} from body not found in database.`
        );
        return NextResponse.json(
          { success: false, message: "Provided user ID not found or invalid." },
          { status: 401 } // Or 403 Forbidden
        );
      }
    } else {
      // userId is required by the schema, so this else block might be redundant if schema validation passes,
      // but it's a safeguard.
      console.error(
        "POST /api/cities: userId is missing in the request body after validation."
      );
      return NextResponse.json(
        { success: false, message: "User ID is required in the request body." },
        { status: 400 }
      );
    }
    // --- END: Handling user ID from body ---

    // --- Refined Payload User Handling (Optional, keep if your payload includes other users to associate) ---
    // Note: This loop handles additional users sent in the 'users' array of the payload.
    // If you ONLY associate the currently logged-in user, you can remove this entire loop.
    // If you keep it, ensure it handles potential conflicts robustly as discussed previously.
    for (const payloadUser of payloadUsers) {
      let userEntity = null;
      // Try finding by githubId, email, or username from payloadUser data
      if (payloadUser.githubId) {
        userEntity = await userRepo.findOne({
          where: { githubId: payloadUser.githubId },
        });
      }
      if (!userEntity && payloadUser.email) {
        userEntity = await userRepo.findOne({
          where: { email: payloadUser.email },
        });
      }
      if (!userEntity && payloadUser.username) {
        userEntity = await userRepo.findOne({
          where: { username: payloadUser.username },
        });
      }

      if (!userEntity) {
        // User not found, create new from payload (handle password/githubId based on payload)
        console.log(
          `POST /api/cities: Creating new user from payload data (email: ${payloadUser.email}, username: ${payloadUser.username})...`
        );
        userEntity = userRepo.create({
          ...payloadUser,
          password: payloadUser.githubId ? null : payloadUser.password,
        });
        try {
          await userRepo.save(userEntity);
        } catch (saveError) {
          console.error(
            "POST /api/cities: Error saving payload user:",
            saveError
          );
          // Decide error handling: fail the whole request or skip this user?
        }
      } else {
        // Found existing user from payload, optionally link githubId if not linked
        if (payloadUser.githubId && userEntity.githubId === null) {
          console.log(
            `POST /api/cities: Linking GitHub ID ${payloadUser.githubId} from payload to existing user (ID: ${userEntity.id}).`
          );
          userEntity.githubId = payloadUser.githubId;
          try {
            await userRepo.save(userEntity);
          } catch (saveError) {
            console.error(
              "POST /api/cities: Error linking payload user:",
              saveError
            );
          }
        } else {
          console.log(
            `POST /api/cities: Payload user (email: ${payloadUser.email}) matched existing user (ID: ${userEntity.id}).`
          );
        }
      }

      // Add the resolved payload user entity if valid and not already added (e.g., main user was also in payloadUsers)
      if (
        userEntity &&
        userEntity.id &&
        !userEntities.find((e) => e.id === userEntity.id)
      ) {
        userEntities.push(userEntity);
      } else if (!userEntity) {
        console.error(
          `POST /api/cities: Could not resolve/create payload user (email: ${payloadUser.email}). Skipping association.`
        );
      }
    }
    // --- END: Refined Payload User Handling ---

    // Ensure we have at least one user to link the city to (the main user from the body, plus any from payload)
    if (userEntities.length === 0) {
      console.error(
        "POST /api/cities: No user entities resolved for city creation."
      );
      // This should ideally not happen if dbUserId from body was valid
      return NextResponse.json(
        {
          success: false,
          message: "Cannot create city without an associated user.",
        },
        { status: 400 }
      );
    }

    const city = cityRepo.create({
      ...cityData, // City data from the payload (excluding userId and payloadUsers)
      users: userEntities, // Associate the main user + any payload users
      selected: true, // Assuming selected is true by default when adding
    });

    await cityRepo.save(city); // Save the city and its relations

    console.log(
      `POST /api/cities: City ${city.id} saved and associated with ${userEntities.length} users.`
    );

    return NextResponse.json(
      {
        success: true,
        message: "City created and users associated",
        data: city,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/cities:", error);
    // Check for specific errors like unique constraints
    if (error.code === "23505") {
      // PostgreSQL unique violation error code
      console.error(
        "POST /api/cities: Database unique constraint error:",
        error.detail
      );
      return NextResponse.json(
        {
          success: false,
          message: `Database conflict: ${error.detail || error.message}`,
        },
        { status: 409 } // 409 Conflict
      );
    }
    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message, // Expose message for debugging during development
      },
      { status: 500 }
    );
  }
}
// app/api/cities/route.js

// ... imports and ensureDbInitialized ...

export async function GET() {
  // Ensure DB is initialized before any DB interaction
  await ensureDbInitialized();

  const session = await getServerSession(options);

  try {
    const cityRepo = AppDataSource.getRepository(City);

    // Check if the user is authenticated AND has a valid database user ID in the session
    if (!session || !session.user || !session.user.id) {
      console.warn(
        "GET /api/cities: User not authenticated or session user ID missing."
      );
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated or session data incomplete.",
        },
        { status: 401 }
      );
    }

    // session.user.id now comes from token.sub and is the database user ID (as a string)
    const userIdString = session.user.id;
    console.log(
      `GET /api/cities: Fetching cities for user ID: ${userIdString}`
    );

    // Parse the database user ID string to an integer for the query
    const dbUserId = parseInt(userIdString, 10);

    // Validate the parsed ID
    if (isNaN(dbUserId)) {
      console.error(
        `GET /api/cities: Invalid numeric user ID obtained from session: ${userIdString}`
      );
      return NextResponse.json(
        { success: false, message: "Invalid user session ID format." },
        { status: 400 } // Bad Request, as the session data seems malformed
      );
    }

    // Query cities related to the user using the database integer ID
    const cities = await cityRepo.find({
      relations: ["users"], // Load the related users to filter
      where: {
        // Filter cities based on the related 'users' many-to-many relationship
        users: {
          id: dbUserId, // Use the integer database user ID here
        },
      },
      // You might want to order the results
      // order: { name: "ASC" }
    });

    console.log(
      `GET /api/cities: Found ${cities.length} cities for user ID ${dbUserId}`
    );

    return NextResponse.json({ success: true, data: cities }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/cities:", error);
    // Add more specific error handling if needed
    if (error.name === "QueryFailedError") {
      console.error(
        "GET /api/cities Query failed:",
        error.message,
        error.parameters
      );
      return NextResponse.json(
        { success: false, message: `Database query failed: ${error.message}` },
        { status: 500 } // Still 500, but with more specific detail
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message, // Expose message for debugging during development
      },
      { status: 500 }
    );
  }
}

// ... rest of your POST, DELETE, PUT handlers ...
// app/api/cities/route.js

// ... imports including getServerSession and options ...

export async function DELETE(req) {
  await ensureDbInitialized(); // Ensure DB is initialized

  const session = await getServerSession(options);

  try {
    // FIX 1: Check for authenticated user and valid session ID
    if (!session || !session.user || !session.user.id) {
      console.warn(
        "DELETE /api/cities: User not authenticated or session user ID missing."
      );
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated or session data incomplete.",
        },
        { status: 401 } // 401 Unauthorized
      );
    }

    const userIdString = session.user.id;
    const dbUserId = parseInt(userIdString, 10);

    if (isNaN(dbUserId)) {
      console.error(
        `DELETE /api/cities: Invalid numeric user ID from session: ${userIdString}`
      );
      return NextResponse.json(
        { success: false, message: "Invalid user session ID format." },
        { status: 400 } // Bad Request
      );
    }
    console.log(
      `DELETE /api/cities: User ${dbUserId} attempting to delete city.`
    );

    const { osm_id } = await req.json(); // Get osm_id from the request body

    // FIX 2: Find the city AND ensure it is associated with the logged-in user
    const cityRepo = AppDataSource.getRepository(City);
    const city = await cityRepo.findOne({
      where: {
        osm_id: osm_id, // Find by osm_id
        // Add condition to check relationship with the logged-in user
        users: {
          id: dbUserId, // Ensure the city is linked to this user's DB ID
        },
      },
      relations: ["users"], // Must load 'users' relation to filter by it in where clause
    });

    if (!city) {
      // FIX 3: Differentiate between city not found and city not owned by user
      // If city is null, it could be:
      // 1. No city exists with that osm_id
      // 2. A city exists with that osm_id, but is NOT associated with the logged-in user
      // Both cases mean the user cannot delete it via this request.
      console.warn(
        `DELETE /api/cities: City with osm_id ${osm_id} not found or not associated with user ${dbUserId}.`
      );
      return NextResponse.json(
        {
          success: false,
          message: "City not found or you do not have permission to delete it.",
        },
        { status: 404 } // Still 404, or you could use 403 Forbidden for "not owned"
      );
    }

    // If we reach here, the city exists AND is associated with the logged-in user
    console.log(
      `DELETE /api/cities: Found city ${city.id} associated with user ${dbUserId}. Removing...`
    );
    await cityRepo.remove(city); // Remove the city entity

    return NextResponse.json(
      { success: true, message: "City deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/cities:", error);
    // Add more specific error handling if needed (e.g., for QueryFailedError)
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// app/api/cities/route.js

// ... imports including getServerSession and options ...

export async function PUT(req) {
  await ensureDbInitialized(); // Ensure DB is initialized

  const session = await getServerSession(options);

  try {
    // FIX 1: Check for authenticated user and valid session ID
    if (!session || !session.user || !session.user.id) {
      console.warn(
        "PUT /api/cities: User not authenticated or session user ID missing."
      );
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated or session data incomplete.",
        },
        { status: 401 } // 401 Unauthorized
      );
    }

    const userIdString = session.user.id;
    const dbUserId = parseInt(userIdString, 10);

    if (isNaN(dbUserId)) {
      console.error(
        `PUT /api/cities: Invalid numeric user ID from session: ${userIdString}`
      );
      return NextResponse.json(
        { success: false, message: "Invalid user session ID format." },
        { status: 400 } // Bad Request
      );
    }
    console.log(`PUT /api/cities: User ${dbUserId} attempting to update city.`);

    const cityRepo = AppDataSource.getRepository(City);
    const data = await req.json(); // Get update data from the request body

    const { id } = data; // Get the primary key ID from the update data

    if (!id) {
      console.warn("PUT /api/cities: City ID missing from request body.");
      return NextResponse.json(
        { success: false, message: "City ID is required." },
        { status: 400 }
      );
    }

    // FIX 2: Find the city by its primary key ID AND ensure it is associated with the logged-in user
    const city = await cityRepo.findOne({
      where: {
        id: id, // Find by primary key ID
        // Add condition to check relationship with the logged-in user
        users: {
          id: dbUserId, // Ensure the city is linked to this user's DB ID
        },
      },
      relations: ["users"], // Must load 'users' relation to filter by it
    });

    if (!city) {
      // FIX 3: Differentiate between city not found and city not owned by user
      console.warn(
        `PUT /api/cities: City with ID ${id} not found or not associated with user ${dbUserId}.`
      );
      return NextResponse.json(
        {
          success: false,
          message: "City not found or you do not have permission to update it.",
        },
        { status: 404 } // Still 404, or 403 Forbidden
      );
    }

    // If we reach here, the city exists AND is associated with the logged-in user
    console.log(
      `PUT /api/cities: Found city ${city.id} associated with user ${dbUserId}. Updating...`
    );

    // FIX 4: Prevent updating the 'users' relation via Object.assign
    // Object.assign will try to overwrite the 'users' relation array, which is usually not intended
    // when updating other city properties. Filter out the 'users' property from the update data.
    const { users, ...updateData } = data; // Destructure to exclude 'users'

    Object.assign(city, updateData); // Apply update data (excluding users)
    await cityRepo.save(city); // Save the updated city entity

    return NextResponse.json(
      { success: true, message: "City updated successfully", data: city },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/cities:", error);
    // Add more specific error handling if needed
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
