// src/app/api/cities/route.js (or .ts)

import { z } from "zod";
import { NextResponse } from "next/server";
// Import ensureDbInitialized and AppDataSource from the central file
import { ensureDbInitialized, AppDataSource } from "../../database/data-source";
import { City } from "@/app/entity/City";
// REMOVE the import of your old User entity
// import { User } from "@/app/entity/User"; // <--- REMOVE THIS

// *** Import Clerk's authentication helper ***
import { auth } from "@clerk/nextjs/server";

// *** Update citySchema for the POST request ***
// It should validate only the city data properties expected in the body.
// The clerkUserId will be obtained on the server using auth().
const citySchema = z.object({
  // REMOVE userId from the schema - it's NOT expected in the body anymore
  // userId: z.union([z.string().transform((val) => parseInt(val, 10)), z.number()]).refine((val) => !isNaN(val), { message: "User ID must be a valid number", }),
  name: z.string(),
  country: z.string(),
  countrycode: z.string().length(2),
  county: z.string().optional(),
  osm_type: z.string(),
  osm_id: z.number(), // osm_id is used for finding duplicates
  osm_key: z.string(),
  osm_value: z.string(),
  extent: z.array(z.number()).optional(),
  geometry: z.object({
    coordinates: z.array(z.number()),
  }),
  image: z.string().optional(),
  // If you need 'selected' in the payload, add it here
  // selected: z.boolean().optional(), // Assuming 'selected' defaults to true in entity
});

// --- POST handler: Add a favorite city ---
export async function POST(req) {
  await ensureDbInitialized(); // Ensure DB is initialized

  // *** Get Clerk user ID ***
  const { userId: clerkUserId } = await auth(); // <--- Get Clerk user ID here

  // *** Authentication check: User must be logged in ***
  if (!clerkUserId) {
    console.warn("POST /api/cities: User not authenticated (Clerk).");
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 } // 401 Unauthorized
    );
  }
  console.log(
    `POST /api/cities: Clerk user ${clerkUserId} attempting to add city.`
  );

  const cityRepo = AppDataSource.getRepository(City);
  // REMOVE User repo as User entity is gone
  // const userRepo = AppDataSource.getRepository(User);

  try {
    const data = await req.json();

    // *** Validate incoming city data ***
    // Schema expects only city properties now
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

    // Extract validated city data
    // REMOVE userId and payloadUsers from the extraction as they are not in schema/body
    const cityData = parsedData.data;
    // Note: If your original POST allowed associating *other* users via a 'users' array
    // in the payload, that feature needs to be completely re-thought with Clerk IDs.
    // Assuming "favorite" means linking to the logged-in user only.

    // *** Check if the city with this osm_id is already favorited by this Clerk user ***
    const existingCity = await cityRepo.findOne({
      where: {
        osm_id: cityData.osm_id, // osm_id from the payload
        clerkUserId: clerkUserId, // Filter by the logged-in Clerk user ID
      },
    });

    if (existingCity) {
      console.warn(
        `POST /api/cities: City with osm_id ${cityData.osm_id} already favorited by user ${clerkUserId}.`
      );
      // Return conflict status if already favorited
      return NextResponse.json(
        { success: false, message: "City already in favorites." },
        { status: 409 } // 409 Conflict
      );
    }

    // *** Create the new city entity in your database ***
    const city = cityRepo.create({
      ...cityData, // City data from the validated payload
      clerkUserId: clerkUserId, // <--- Assign the Clerk User ID here (string)
      selected: true, // Assuming selected is true by default when adding
      // REMOVE any old relations to the custom User entity
      // users: userEntities, // REMOVE THIS LINE - old relation
    });

    await cityRepo.save(city); // Save the new city entity

    console.log(
      `POST /api/cities: City ${city.id} saved for Clerk user ${clerkUserId}.`
    );

    return NextResponse.json(
      {
        success: true,
        message: "City created and added to favorites",
        data: city,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/cities:", error);
    // Check for specific errors like unique constraints (add one on clerkUserId + osm_id for robustness)
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

// --- GET handler: Fetch favorite cities for the logged-in user ---
export async function GET() {
  await ensureDbInitialized(); // Ensure DB is initialized

  // *** Get Clerk user ID ***
  const { userId: clerkUserId } = await auth(); // <--- Get Clerk user ID here

  // *** Authentication check: User must be logged in ***
  if (!clerkUserId) {
    console.warn("GET /api/cities: User not authenticated (Clerk).");
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }
  console.log(`GET /api/cities: Clerk user ${clerkUserId} fetching cities.`);

  const cityRepo = AppDataSource.getRepository(City);

  try {
    // *** Query cities associated with this Clerk User ID (Option 1 Schema) ***
    const cities = await cityRepo.find({
      where: { clerkUserId: clerkUserId }, // Filter by the new clerkUserId column (string match)
      // REMOVE the old relation loading as the 'users' relation is removed from City entity
      // relations: ["users"], // REMOVE THIS LINE
      // You might want to order the results
      // order: { name: "name", "ASC" },
    });

    console.log(
      `GET /api/cities: Found ${cities.length} cities for Clerk user ID ${clerkUserId}.`
    );
    return NextResponse.json({ success: true, data: cities }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/cities:", error);
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

// --- DELETE handler: Remove a favorite city ---
export async function DELETE(req) {
  await ensureDbInitialized(); // Ensure DB is initialized

  // *** Get Clerk user ID ***
  const { userId: clerkUserId } = await auth(); // <--- Get Clerk user ID here

  // *** Authentication check: User must be logged in ***
  if (!clerkUserId) {
    console.warn("DELETE /api/cities: User not authenticated (Clerk).");
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }
  console.log(
    `DELETE /api/cities: Clerk user ${clerkUserId} attempting to delete city.`
  );

  const cityRepo = AppDataSource.getRepository(City);

  try {
    const { osm_id } = await req.json(); // Get osm_id from the request body

    // *** Find the city AND ensure it belongs to the logged-in Clerk user (Option 1 Schema) ***
    const cityToDelete = await cityRepo.findOne({
      where: {
        osm_id: osm_id, // Find by osm_id from the body
        clerkUserId: clerkUserId, // Filter by the logged-in Clerk user ID (string match)
      },
      // REMOVE the old relation loading
      // relations: ["users"], // REMOVE THIS LINE
    });

    if (!cityToDelete) {
      // If cityToDelete is null, it means either the city by osm_id doesn't exist,
      // or it exists but is not linked to THIS Clerk user.
      console.warn(
        `DELETE /api/cities: City with osm_id ${osm_id} not found or not associated with Clerk user ${clerkUserId}.`
      );
      return NextResponse.json(
        {
          success: false,
          message: "City not found or you do not have permission to delete it.",
        },
        { status: 404 } // Still 404, or 403 Forbidden for "not owned"
      );
    }

    // *** Perform Deletion (Option 1 Schema) ***
    // Remove the City entity itself, as it's solely linked to this user.
    await cityRepo.remove(cityToDelete);

    console.log(
      `DELETE /api/cities: City with osm_id ${osm_id} deleted for Clerk user ${clerkUserId}.`
    );
    return NextResponse.json(
      { success: true, message: "City deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/cities:", error);
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

// --- PUT handler: Update a favorite city ---
export async function PUT(req) {
  await ensureDbInitialized(); // Ensure DB is initialized

  // *** Get Clerk user ID ***
  const { userId: clerkUserId } = await auth(); // <--- Get Clerk user ID here

  // *** Authentication check: User must be logged in ***
  if (!clerkUserId) {
    console.warn("PUT /api/cities: User not authenticated (Clerk).");
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }
  console.log(
    `PUT /api/cities: Clerk user ${clerkUserId} attempting to update city.`
  );

  const cityRepo = AppDataSource.getRepository(City);

  try {
    const data = await req.json(); // Get update data from the request body

    const { id } = data; // Get the primary key ID from the update data

    if (!id) {
      console.warn("PUT /api/cities: City ID missing from request body.");
      return NextResponse.json(
        { success: false, message: "City ID is required." },
        { status: 400 }
      );
    }

    // *** Find the city by its primary key ID AND ensure it belongs to the Clerk user (Option 1 Schema) ***
    const cityToUpdate = await cityRepo.findOne({
      where: { id: id, clerkUserId: clerkUserId }, // Filter by City PK ID (int) and Clerk ID (string)
      // REMOVE the old relation loading
      // relations: ["users"], // REMOVE THIS LINE
    });

    if (!cityToUpdate) {
      console.warn(
        `PUT /api/cities: City with ID ${id} not found or not associated with Clerk user ${clerkUserId}.`
      );
      return NextResponse.json(
        {
          success: false,
          message: "City not found or you do not have permission to update it.",
        },
        { status: 404 } // Still 404, or 403 Forbidden
      );
    }

    // *** Perform Update ***
    console.log(
      `PUT /api/cities: Found city ${cityToUpdate.id} associated with Clerk user ${clerkUserId}. Updating...`
    );

    // Prevent updating the 'users' relation or the incoming userId/clerkUserId
    // Filter out any properties from the payload that shouldn't be updated directly on the City entity
    // Add 'clerkUserId' to the filtered list in case it was accidentally sent
    const {
      users,
      userId: incomingUserId,
      clerkUserId: incomingClerkUserId,
      ...updateData
    } = data; // Filter out specific fields

    Object.assign(cityToUpdate, updateData); // Apply update data
    await cityRepo.save(cityToUpdate); // Save the updated City entity

    console.log(
      `PUT /api/cities: City with ID ${id} updated for Clerk user ${clerkUserId}.`
    );
    return NextResponse.json(
      {
        success: true,
        message: "City updated successfully",
        data: cityToUpdate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/cities:", error);
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
