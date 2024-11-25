import { z } from "zod";
import { NextResponse } from "next/server";
import { AppDataSource } from "../../database/data-source";
import { City } from "@/app/entity/City";

async function ensureDbInitialized() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

const citySchema = z.object({
  name: z.string(),
  country: z.string(),
  countrycode: z.string().length(2), // Example validation for country code length
  county: z.string().optional(), // Optional field
  osm_type: z.string(),
  osm_id: z.number(),
  osm_key: z.string(),
  osm_value: z.string(),
  extent: z.array(z.number()).optional(), // Optional field
  geometry: z.any(), // Adjust to your actual expected type for geometry
});

export async function POST(req) {
  await ensureDbInitialized();
  try {
    const cityRepo = AppDataSource.getRepository(City);
    const data = await req.json();

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

    const city = cityRepo.create({ ...parsedData.data, selected: true });
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
