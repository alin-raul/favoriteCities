// app/api/auth/[...nextauth]/options.ts

import bcrypt from "bcrypt";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { ensureDbInitialized, AppDataSource } from "@/app/database/data-source";
import { User } from "@/app/entity/User";

// Import AuthOptions type
import type { AuthOptions } from "next-auth"; // <--- Import using 'type'

// Optional: Import provider types if you cast providers
// import { OAuthConfig, CredentialsConfig } from "next-auth/providers";
// import { GithubProfile } from "next-auth/providers/github";

// REMOVE any local ensureDbInitialized definition here.

// FIX: Export options with the AuthOptions type annotation, NO 'as const'
export const options: AuthOptions = {
  // <--- Use ': AuthOptions', NO 'as const' here
  pages: {
    signIn: "/login",
  },

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: (profile) => {
        return {
          id: profile.id.toString(),
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "User Name" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Type here...",
        },
      },
      authorize: async (credentials) => {
        // Type inferred or added previously
        await ensureDbInitialized();
        try {
          const userRepo = AppDataSource.getRepository(User);
          if (!credentials?.username || !credentials.password) return null;
          const user = await userRepo.findOne({
            where: { username: credentials.username },
          });
          if (!user || user.password === null)
            throw new Error("Invalid username or password");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) throw new Error("Invalid username or password");
          console.log(
            `User ${user.username} (ID: ${user.id}) authenticated via credentials.`
          );
          const { password, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            id: user.id, // Database INTEGER ID
            username: user.username,
            email: user.email,
            name: user.name,
            image: user.image || null,
          };
        } catch (error) {
          console.error("Credentials Authorization error:", error);
          throw new Error("Invalid username or password");
        }
      },
    }),
    // ... Add any other providers ...
  ],

  callbacks: {
    // ... session callback ...

    async jwt({ token, user, account, profile }) {
      await ensureDbInitialized();
      const userRepo = AppDataSource.getRepository(User);

      console.log("JWT Callback received:", {
        user: user
          ? { id: user.id, username: (user as any).username, email: user.email }
          : null, // Log key user properties
        account: account
          ? { provider: account.provider, type: account.type }
          : null,
        profile: profile ? { name: (profile as any)?.name } : null,
        token: token ? { sub: token.sub, username: token.username } : null, // Log key token properties
      });

      if (user) {
        // 'user' is populated ONLY on initial sign-in
        console.log("JWT Callback: Initial sign-in.");
        let dbUser = null; // This variable will hold the TypeORM database entity

        // --- Handle Initial Sign-in Logic ---
        if (account && account.provider === "github") {
          // --- Handle GitHub Login (OAuth) ---
          console.log("JWT Callback: Handling GitHub login from provider...");
          const githubUserId = user.id; // string ID from provider profile
          const email = user.email; // Email from GitHub profile
          const username = user.username; // Username from GitHub profile
          const name = (profile as any)?.name; // Name might be in profile directly for OAuth
          const image = user.image; // GitHub avatar_url from profile

          // Find/Create/Link logic...
          dbUser = await userRepo.findOne({
            where: { githubId: githubUserId },
          }); // 1. Find by githubId

          if (dbUser) {
            // Found existing by githubId
            console.log(
              `JWT: Found existing DB user by githubId: ${githubUserId} (DB ID: ${dbUser.id}).`
            );
            let updated = false;
            if (image && dbUser.image !== image) {
              dbUser.image = image;
              updated = true;
            }
            if (name && dbUser.name !== name) {
              dbUser.name = name;
              updated = true;
            } // Optional: sync name
            if (updated) {
              try {
                await userRepo.save(dbUser);
                console.log("JWT: User entity updated.");
              } catch (e) {
                console.error("JWT: Error saving user update:", e);
              }
            }
          } else {
            // Not found by githubId, try email/username...
            console.log(
              `JWT: User not found by githubId. Looking up by email/username...`
            );
            let userFoundByEmailOrUsername = null;
            if (email) {
              userFoundByEmailOrUsername = await userRepo.findOne({
                where: { email: email },
              });
            }
            if (!userFoundByEmailOrUsername && username) {
              userFoundByEmailOrUsername = await userRepo.findOne({
                where: { username: username },
              });
            }

            if (userFoundByEmailOrUsername) {
              // Found existing by email or username
              dbUser = userFoundByEmailOrUsername; // Use this existing user
              // Link GitHub if not already linked AND it's safe to link
              if (dbUser.githubId === null) {
                console.log(
                  `JWT: Linking GitHub ID ${githubUserId} to existing user (ID: ${dbUser.id}).`
                );
                dbUser.githubId = githubUserId;
                dbUser.image = image; // Update image when linking
                if (name && dbUser.name !== name) {
                  dbUser.name = name;
                } // Optional: sync name
                try {
                  await userRepo.save(dbUser);
                  console.log(
                    "JWT: User entity updated with GitHub link and image."
                  );
                } catch (e) {
                  console.error("JWT: Error saving linkage:", e);
                }
              } else {
                console.warn(
                  `JWT: User found by email/username (ID: ${dbUser.id}) already linked to GitHub ID ${dbUser.githubId}. Cannot link ${githubUserId}.`
                );
                // Use the existing dbUser, no update to githubId/image here
              }
            } else {
              // Not found by anything -> Create new user
              console.log("JWT: Creating new DB user for GitHub profile");
              // Ensure required fields from provider user are not null before creating
              if (!username || !email) {
                // Basic check for required fields
                console.error(
                  `JWT: Cannot create new user, missing required fields from GitHub profile (username: ${username}, email: ${email}).`
                );
                // Do NOT set dbUser, it remains null. Token will be cleared below.
              } else {
                dbUser = userRepo.create({
                  githubId: githubUserId,
                  username: username,
                  email: email,
                  name: name, // Use name from profile
                  image: image, // Use dbUser.image
                  password: null, // OAuth user
                });
                try {
                  await userRepo.save(dbUser);
                  console.log(
                    `JWT: New user created with DB ID: ${dbUser.id}.`
                  );
                } catch (e) {
                  console.error("JWT: Error creating user:", e);
                  dbUser = null; /* Handle save error */
                }
              }
            }
          }
        } else if (user && user.id) {
          // Credentials login (user object from authorize callback)
          // Handle Credentials login
          console.log("JWT Callback: Handling Credentials login...");
          // Assume user.id from authorize is the database user ID (number or string based on authorize return type)
          dbUser = await userRepo.findOne({
            where: { id: user.id as unknown as number },
          }); // Look up by DB ID (cast to number)
          if (!dbUser) {
            console.error(
              `JWT Callback: User ID ${user.id} from authorize not found in database!`
            );
            // Do NOT set dbUser, it remains null. Token will be cleared below.
          } else {
            console.log(
              `JWT: Resolved DB user for Credentials login: ${dbUser.username} (ID: ${dbUser.id})`
            );
          }
        } else {
          // Unexpected user object on initial sign-in
          console.error(
            "JWT Callback: Unexpected user object on sign-in:",
            user
          );
          // Do NOT set dbUser, it remains null. Token will be cleared below.
        }

        // --- Populate Token from Resolved Database User (dbUser) ---
        // If dbUser was successfully resolved (found, linked, or newly created),
        // populate the token properties from the dbUser entity.
        if (dbUser && dbUser.id !== undefined && dbUser.id !== null) {
          // Ensure dbUser is valid and has a DB ID
          console.log(
            `JWT Callback: Populating token for DB User ID: ${dbUser.id}`
          );
          token.sub = dbUser.id.toString(); // Store DB ID (number) as string in 'sub'
          token.username = dbUser.username; // Get from DB entity
          token.name = dbUser.name || dbUser.username; // Get name from DB entity, fallback to username
          token.email = dbUser.email; // Get email from DB entity
          token.image = dbUser.image || null; // Get from dbUser.image property
          // Add other fields from dbUser if needed in token
          console.log("JWT Callback: Token populated:", token);
        } else {
          // dbUser was null (e.g., due to conflict, missing required fields, or save error)
          console.warn(
            "JWT Callback: dbUser was null/invalid. Clearing token user details to prevent partial session."
          );
          // Clear all user-specific properties in the token
          token.sub = undefined; // Explicitly clear crucial fields
          token.username = undefined;
          token.name = undefined;
          token.email = undefined;
          token.image = undefined;
          // Keep other token properties like jti, iat, exp if they exist
        }
      } else {
        // Subsequent calls (user is null)
        // --- Handle Subsequent Calls (Session Updates, etc.) ---
        // 'user' is null on subsequent calls when NextAuth validates/updates the token.
        // The 'token' object contains the existing JWT claims from the cookie.
        // No database lookup needed here unless you want to refresh user data frequently.
        console.log(
          "JWT Callback: Handling subsequent token update. Token:",
          token
        );
        // The token already contains the db user ID and other populated fields from the initial sign-in (stored as token.sub, token.username, etc.).
        // Just return the existing token.
      }

      // --- ALWAYS Return the token object ---
      // Regardless of whether user was present or dbUser was resolved,
      // always return the modified (or original) token object.
      return token; // <--- FIX: Always return the token object
    },
  },

  // ... rest of options (session, secret, debug) ...
  session: {
    strategy: "jwt", // Type is 'jwt' literal.
  },
  secret: process.env.NEXTAUTH_SECRET as string, // Cast as string
};
