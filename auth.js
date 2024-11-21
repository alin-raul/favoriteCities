import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "User Name",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Type here...",
        },
      },
      authorize: async (credentials) => {
        const user = {
          id: "6",
          name: "Raul",
          username: "ssupraem",
          password: "Shnitzel",
        };

        if (
          credentials?.username === user.username &&
          credentials?.password === user.password
        ) {
          return user;
        } else {
          console.error("Invalid credentials");
          return null;
        }
      },
    }),
  ],
};

export const handlers = NextAuth(authOptions); // Ensure this export is correct

export async function auth(req) {
  // Extract JWT token from cookies or headers
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (!token) {
    // If no token is found, redirect to login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optionally, add more custom logic to verify the token further
  try {
    // Example: Verifying token using a secret (if needed)
    verify(token, process.env.JWT_SECRET);

    // If verification passes, allow the request to continue
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed", error);
    // If verification fails, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
