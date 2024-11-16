import { NextResponse } from "next/server";
import { AppDataSource } from "../../database/data-source";
import { City } from "@/app/entity/City";

async function ensureDbInitialized() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

export async function POST(req) {
  await ensureDbInitialized();
  try {
    const cityRepo = AppDataSource.getRepository(City);
    const data = await req.json();

    // Destructure the necessary fields from the data
    const {
      name,
      country,
      countrycode,
      county,
      osm_type,
      osm_id,
      osm_key,
      osm_value,
      extent,
      geometry,
    } = data;

    // Create an array to collect missing fields
    const missingFields = [];

    // Check each required field and log the missing ones
    if (!name) missingFields.push("name");
    if (!country) missingFields.push("country");
    if (!countrycode) missingFields.push("countrycode");
    if (!osm_type) missingFields.push("osm_type");
    if (!osm_id) missingFields.push("osm_id");
    if (!osm_key) missingFields.push("osm_key");
    if (!osm_value) missingFields.push("osm_value");
    if (!geometry) missingFields.push("geometry");

    // If there are missing fields, log them and return a response
    if (missingFields.length > 0) {
      console.error("Missing fields:", missingFields); // Log missing fields
      return NextResponse.json(
        { success: false, message: "All fields are required.", missingFields },
        { status: 400 }
      );
    }

    // Proceed to create and save the city if all fields are present
    const city = cityRepo.create({ ...data, selected: true });
    await cityRepo.save(city);

    return NextResponse.json(
      { success: true, message: "City created", data: city },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/cities:", error);
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

export async function GET() {
  await ensureDbInitialized();
  try {
    const cityRepo = AppDataSource.getRepository(City);
    const cities = await cityRepo.find();

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

export async function DELETE(req) {
  await ensureDbInitialized();
  try {
    const { osm_id } = await req.json();
    const cityRepo = AppDataSource.getRepository(City);

    const city = await cityRepo.findOne({ where: { osm_id } });
    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    await cityRepo.remove(city);
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

export async function PUT(req) {
  await ensureDbInitialized();
  try {
    const cityRepo = AppDataSource.getRepository(City);
    const data = await req.json();

    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "City ID is required." },
        { status: 400 }
      );
    }

    const city = await cityRepo.findOne({ where: { id } });
    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    Object.assign(city, data);
    await cityRepo.save(city);

    return NextResponse.json(
      { success: true, message: "City updated successfully", data: city },
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
