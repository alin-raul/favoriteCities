import { NextResponse } from "next/server";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../entity/User";

// Initialize the data source only once
if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

export async function POST(req) {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const { name, age } = await req.json(); // Fetch JSON body

    // Validate input
    if (!name || typeof age !== "number") {
      return NextResponse.json(
        { message: "Invalid input" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = userRepo.create({ name, age }); // Create a new User instance
    await userRepo.save(user); // Save user to the database

    return NextResponse.json(
      { message: "User created", user },
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error occurred:", error); // Log error for debugging
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
    const users = await userRepo.find(); // Fetch all users
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
    const { id } = await req.json(); // Correctly extract ID from the request body
    const userRepo = AppDataSource.getRepository(User);

    // Find the user by ID
    const userToDelete = await userRepo.findOne({ where: { id } });

    if (!userToDelete) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 } // Return 404 if the user is not found
      );
    }

    // Remove the user
    await userRepo.remove(userToDelete);

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      { status: 200 } // Return 200 for successful deletion
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
    const { id, name, age } = await req.json(); // Fetch JSON body

    // Validate input
    if (!id || !name || typeof age !== "number") {
      return NextResponse.json(
        { message: "Invalid input" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Find the user by ID
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

    // Update user properties
    existingUser.name = name;
    existingUser.age = age;

    // Save updated user to the database
    await userRepo.save(existingUser);

    return NextResponse.json(
      { message: "User updated successfully", user: existingUser },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error occurred:", error); // Log error for debugging
    return NextResponse.json(
      { message: "Internal Server Error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
