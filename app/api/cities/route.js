import { z } from "zod";
import { NextResponse } from "next/server";
import { AppDataSource } from "../../database/data-source";
import { City } from "@/app/entity/City";
import { User } from "@/app/entity/User";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

async function ensureDbInitialized() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

const userSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  id: z.string().optional(),
});

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
  geometry: z.any(),
});

export async function POST(req) {
  await ensureDbInitialized();
  try {
    const cityRepo = AppDataSource.getRepository(City);
    const userRepo = AppDataSource.getRepository(User);
    const data = await req.json();

    const session = await getServerSession(options);
    console.log(session);

    const userEntities = [];

    if (session && session.user) {
      const { email, name, id, username } = session.user;

      let user = await userRepo.findOne({ where: { id } });

      if (!user) {
        user = userRepo.create({
          name,
          email,
          id,
          username,
          password: null,
        });
        await userRepo.save(user);
      }

      userEntities.push(user);
    }

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

    const { users = [], ...cityData } = parsedData.data;

    for (const user of users) {
      let userEntity = await userRepo.findOne({ where: { email: user.email } });

      if (!userEntity) {
        userEntity = userRepo.create({
          ...user,
          password: user.githubId ? null : user.password,
        });
        await userRepo.save(userEntity);
      }
      userEntities.push(userEntity);
    }

    const city = cityRepo.create({
      ...cityData,
      users: userEntities,
      selected: true,
    });
    await cityRepo.save(city);

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

  const session = await getServerSession(options);

  try {
    const userRepo = AppDataSource.getRepository(User);
    const cityRepo = AppDataSource.getRepository(City);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const cities = await cityRepo.find({
      relations: ["users"],
      where: {
        users: {
          id: userId, // Filter cities where the user is associated
        },
      },
    });

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
