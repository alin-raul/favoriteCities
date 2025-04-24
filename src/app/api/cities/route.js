import { z } from "zod";
import { NextResponse } from "next/server";
import { AppDataSource } from "../../database/data-source";
import { City } from "@/app/entity/City";
import { User } from "@/app/entity/User";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { ensureDbInitialized } from "../../database/data-source";

const citySchema = z.object({
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
  await ensureDbInitialized();
  try {
    const cityRepo = AppDataSource.getRepository(City);
    const userRepo = AppDataSource.getRepository(User);
    const data = await req.json();

    const session = await getServerSession(options);

    const userEntities = [];

    // --- START: Corrected Session User Handling ---
    if (session && session.user) {
      // Destructure session user data (GitHub user info)
      const { email, name, id: githubUserId, username } = session.user;

      let user = null; // Initialize user entity

      // 1. Attempt to find user by GitHub ID (primary link)
      console.log(`Attempting to find user by githubId: ${githubUserId}`);
      user = await userRepo.findOne({ where: { githubId: githubUserId } });

      if (!user) {
        // 2. If not found by githubId, attempt to find user by email (might be existing user)
        console.log(
          `User not found by githubId. Attempting to find user by email: ${email}`
        );
        user = await userRepo.findOne({ where: { email: email } });

        if (user) {
          // Found user by email. This user exists but isn't linked by this specific githubId.
          // Check if they are linked to *any* githubId already.
          if (user.githubId === null) {
            // 2a. User found by email, not linked to GitHub. Link this account.
            console.log(
              `Linking GitHub account ${githubUserId} to existing user with email ${email} (ID: ${user.id}).`
            );
            user.githubId = githubUserId;
            // Optional: Update name/image if desired, but be cautious with username sync.
            // if (!user.name) user.name = name; // Update name if missing
            // if (!user.image) user.image = session.user.image; // Update image if missing
            await userRepo.save(user); // Save the updated user record
          } else {
            // 2b. User found by email, but already linked to a *different* GitHub ID.
            // This is a conflict or indicates a user has multiple accounts (one linked here, one logging in via GitHub).
            // We cannot link *this* session's githubId. The existing user record is used.
            console.warn(
              `Existing user with email ${email} (ID: ${user.id}) found, already linked to GitHub ID ${user.githubId}. Cannot link to ${githubUserId}. Using existing user.`
            );
          }
        } else {
          // 3. User not found by githubId AND not found by email.
          // Attempt to find user by username (to prevent duplicate username error on creation)
          console.log(
            `User not found by email. Attempting to find user by username: ${username}`
          );
          user = await userRepo.findOne({ where: { username: username } });

          if (user) {
            // 3a. User found by username, but different email/githubId.
            // This user exists with the desired username, but it's *not* the same account
            // as the one logging in via GitHub (because email/githubId didn't match).
            // We cannot create a new user with this username because it's taken.
            // We cannot link this session to this user found by username because email/githubId don't match.
            console.error(
              `Conflict: Existing user found with username ${username} (ID: ${user.id}). Email: ${user.email}. Conflicts with GitHub session user (email: ${email}, githubId: ${githubUserId}). Cannot create or link session user.`
            );
            // Set user to null to indicate that the session user could not be resolved/created as a database entity for linking to the city.
            user = null;
            // You might consider throwing an error here or returning a specific API response
            // if linking the city to the session user is mandatory.
            // throw new Error("Account conflict: Username already exists."); // Example
            // return NextResponse.json({ success: false, message: "Username already exists. Please use a different login method or contact support." }, { status: 409 }); // Example
          } else {
            // 4. User not found by githubId, email, AND username. It is safe to create a new user record.
            console.log(
              `User not found by githubId, email, or username. Creating new user for githubId ${githubUserId}, email ${email}, username ${username}.`
            );
            user = userRepo.create({
              githubId: githubUserId, // Store the GitHub ID
              username: username, // Use GitHub username
              email: email, // Use GitHub email
              name: name, // Use GitHub name
              password: null, // No password for OAuth user
              // createdAt handled by the entity default
            });
            // This save should now succeed as githubId, email, and username are unique among *existing* users.
            await userRepo.save(user);
          }
        }
      }

      // After the lookup/creation logic, 'user' is either the found/linked user,
      // a newly created user, or null if a conflict prevented resolution.
      // Only add the resolved user entity to the list if a valid user object exists.
      if (user && user.id) {
        // Check if user object is valid and has a database ID
        // Avoid pushing duplicates if this logic were inside a loop, although here it's just for the session user.
        // Still good practice to ensure uniqueness if userEntities might get populated elsewhere.
        if (!userEntities.find((e) => e.id === user.id)) {
          userEntities.push(user);
        }
      } else {
        // If user is null here, it means the session user could not be resolved
        // to a database entity due to a conflict (specifically the username conflict).
        console.error(
          "Session user could not be resolved to a database entity for city creation due to conflict."
        );
        // Decide if city creation should fail if the session user cannot be linked.
        // If yes, you should handle this failure explicitly, e.g., by throwing an error
        // which would be caught by the outer catch block, or by returning a response here.
        // For now, the code will proceed, but userEntities will not contain the session user.
        // This might lead to the city being created but not linked to the logged-in user, or failing later
        // if linking to the session user is implicitly required elsewhere.
        // A safer approach is to throw an error:
        // throw new Error("Could not link session user to database.");
      }
    }
    // --- END: Corrected Session User Handling ---

    // Ensure we have at least one user to link the city to (the session user, or users from payload)
    if (userEntities.length === 0) {
      console.error("No user entities resolved for city creation.");
      return NextResponse.json(
        {
          success: false,
          message: "Cannot create city without an associated user.",
        },
        { status: 400 } // Or 401 if authentication is mandatory
      );
    }

    // ... The rest of your code for handling 'payloadUsers' loop and city creation ...
    // Note: The loop for `payloadUsers` might also benefit from similar robust find/link/create logic
    // if those payload users can also potentially conflict with existing users (e.g., if they provide email/username/githubId).
    // For now, this fix specifically targets the duplicate username error from the session user flow.

    const parsedData = citySchema.safeParse(data);

    if (!parsedData.success) {
      console.error("Validation errors:", parsedData.error.errors);
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsedData.error.errors,
        },
        { status: 400 }
      );
    }

    const { users: payloadUsers = [], ...cityData } = parsedData.data;

    // --- Refined Payload User Handling (Optional, but recommended) ---
    for (const payloadUser of payloadUsers) {
      let userEntity = null;
      // Try finding by githubId if present in payload
      if (payloadUser.githubId) {
        userEntity = await userRepo.findOne({
          where: { githubId: payloadUser.githubId },
        });
      }

      if (!userEntity) {
        // Try finding by email or username if not found by githubId
        userEntity = await userRepo.findOne({
          where: [
            { email: payloadUser.email },
            { username: payloadUser.username },
          ],
        });

        if (userEntity) {
          // Found existing user by email/username. Link githubId if not already linked.
          if (payloadUser.githubId && userEntity.githubId === null) {
            console.log(
              `Linking GitHub account ${payloadUser.githubId} from payload to existing user with email ${payloadUser.email}`
            );
            userEntity.githubId = payloadUser.githubId;
            await userRepo.save(userEntity);
          } else {
            // Found user, but couldn't link (already linked elsewhere, or no githubId in payload). Use existing.
            console.warn(
              `User from payload (email: ${payloadUser.email}, username: ${payloadUser.username}) matched existing user (ID: ${userEntity.id}), but could not link GitHub ID ${payloadUser.githubId}. Using existing user.`
            );
          }
        } else {
          // User not found by githubId, email, or username from payload. Safe to create.
          console.log(
            `Creating new user from payload: email ${payloadUser.email}, username ${payloadUser.username}`
          );
          userEntity = userRepo.create({
            ...payloadUser, // Includes username, email, githubId (if present)
            password: payloadUser.githubId ? null : payloadUser.password, // Apply password logic
          });
          // This save should pass if email/username/githubId from payload are unique globally
          await userRepo.save(userEntity);
        }
      }

      // Add the resolved payload user entity, avoiding duplicates if already added (e.g., session user was also in payload)
      if (
        userEntity &&
        userEntity.id &&
        !userEntities.find((e) => e.id === userEntity.id)
      ) {
        userEntities.push(userEntity);
      } else if (!userEntity) {
        console.error(
          `Could not resolve payload user (email: ${payloadUser.email}, username: ${payloadUser.username}) to a database entity.`
        );
        // Decide error handling if a payload user cannot be resolved.
      }
    }
    // --- END: Refined Payload User Handling ---

    const city = cityRepo.create({
      ...cityData,
      users: userEntities, // Associate all collected user entities (session user + payload users)
      selected: true,
    });

    // Ensure the city object is valid and has associated users before saving
    if (city.users.length === 0) {
      // This check is technically redundant due to the check after session user handling,
      // but adds safety if payload user handling somehow results in an empty list.
      console.error("City has no users associated before save.");
      return NextResponse.json(
        {
          success: false,
          message: "City must be associated with at least one user.",
        },
        { status: 400 }
      );
    }

    await cityRepo.save(city); // Save the city and its relations

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
    // IMPORTANT: Check the error type here. If it's still a duplicate key error
    // after implementing this logic, it might mean the payload user loop
    // is causing it, or there's a subtle edge case.
    if (error.code === "23505") {
      // PostgreSQL unique violation error code
      return NextResponse.json(
        {
          success: false,
          message: `Database conflict: ${error.detail || error.message}`,
        },
        { status: 409 } // 409 Conflict
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message, // Expose error message for debugging, maybe remove in production
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
