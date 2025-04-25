// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Extend the Session object
declare module "next-auth" {
  interface Session {
    // Combine DefaultSession user properties with our custom ones
    user: {
      id: string; // Your database user ID (string, from token.sub)
      username: string; // Your username (string, from token.username)
      // The default properties from DefaultSession['user']
      name: string | null; // Matches JWT: name is string | null
      email: string | null; // Matches JWT: email is string | null
      image: string | null; // Matches JWT: image is string | null
      // Add any other properties you put into session.user
    } & DefaultSession["user"]; // This merge strategy handles optional default props

    // Add any other custom properties you add directly to the session object
    // myCustomSessionProperty?: string;
  }

  // Optional: Extend the User type.
  // This is the object passed as 'user' to callbacks on initial sign-in.
  // It comes from provider profile or authorize return.
  interface User extends DefaultUser {
    // Add custom properties specific to your providers or authorize return
    githubId?: string | null; // Needed if Credentials authorize returns this, or for type safety when using 'user' object from GitHub provider
    username?: string; // Provider profile/authorize often returns 'username' or similar
    // 'id' is usually covered by DefaultUser['id']
    // 'name', 'email', 'image' are usually covered by DefaultUser
  }

  // Optional: Extend AuthOptions if you add custom top-level options
  // (Not usually necessary just for basic config)
  // interface AuthOptions {
  //   myCustomOption?: string;
  // }
}

// Extend the JWT object
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    // Add your custom properties that you explicitly store in the JWT payload
    // These must match the names and types you assign in the jwt callback.
    sub: string; // Database user ID (string)
    username: string; // Username from DB
    name: string | null; // Name from DB (can be null)
    email: string | null; // Email from DB (can be null)
    image: string | null; // Image URL from DB (can be null)
    // Add any other fields you explicitly put onto the token object
  }
}
