import { NextResponse } from "next/server";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../entity/User";

if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

export async function POST(req) {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const { name, age } = await req.json();

    if (!name || typeof age !== "number") {
      return NextResponse.json(
        { message: "Invalid input" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = userRepo.create({ name, age });
    await userRepo.save(user);

    return NextResponse.json(
      { message: "User created", user },
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  const userRepo = AppDataSource.getRepository(User);
  try {
    const users = await userRepo.find();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const userRepo = AppDataSource.getRepository(User);

    const userToDelete = await userRepo.findOne({ where: { id } });

    if (!userToDelete) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    await userRepo.remove(userToDelete);

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/users:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const { id, name, age } = await req.json();

    if (!id || !name || typeof age !== "number") {
      return NextResponse.json(
        { message: "Invalid input" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingUser = await userRepo.findOne({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    existingUser.name = name;
    existingUser.age = age;

    await userRepo.save(existingUser);

    return NextResponse.json(
      { message: "User updated successfully", user: existingUser },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
