import { User } from "@/app/entity/User";
import { AppDataSource } from "@/app/database/data-source";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

async function ensureDbInitialized() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function GET() {
  await ensureDbInitialized();
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find();

    const sanitizedUsers = users.map(({ password, ...user }) => user);

    return NextResponse.json(
      { success: true, data: sanitizedUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/users:", error);
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

export async function POST(req) {
  await ensureDbInitialized();
  try {
    const userRepo = AppDataSource.getRepository(User);
    const data = await req.json();

    const parsedData = userSchema.safeParse(data);

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

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const user = userRepo.create({
      ...parsedData.data,
      password: hashedPassword,
    });
    await userRepo.save(user);

    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { success: true, message: "User created", data: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/users:", error);
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
