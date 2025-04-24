// app/api/auth/[...nextauth]/options.ts

import bcrypt from "bcrypt";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
// Import AppDataSource if you need direct access in callbacks (less common now)
// import { AppDataSource } from "@/app/database/data-source";
import { User } from "@/app/entity/User";
// Import ensureDbInitialized from your data-source file
import { ensureDbInitialized, AppDataSource } from "@/app/database/data-source"; // Ensure AppDataSource is imported here or accessible

// REMOVE any local ensureDbInitialized definition here.
// It should only be in app/database/data-source.js

export const options = {
  pages: {
    signIn: "/login",
  },

  // FIX: Ensure the providers array is a direct property of the options object
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: (profile) => {
        return {
          id: profile.id.toString(), // GitHub ID (string)
          username: profile.login, // GitHub login (username)
          email: profile.email, // GitHub email (might be null if private)
          image: profile.avatar_url, // GitHub avatar URL
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
      // Type annotation added previously
      authorize: async (
        credentials: Record<string, string> | null | undefined
      ) => {
        await ensureDbInitialized(); // Call the imported function

        try {
          const userRepo = AppDataSource.getRepository(User);

          if (!credentials?.username || !credentials.password) {
            console.error("Authorization error: Missing username or password.");
            return null;
          }

          const user = await userRepo.findOne({
            where: { username: credentials.username },
          });

          if (!user) {
            console.log(`User not found for username: ${credentials.username}`);
            throw new Error("Invalid username or password");
          }

          if (user.password === null) {
            console.warn(
              `Credentials login attempted for user ${user.username} (ID: ${user.id}) who has no password set.`
            );
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log(
              `Password invalid for username: ${credentials.username}`
            );
            throw new Error("Invalid username or password");
          }

          console.log(
            `User ${user.username} (ID: ${user.id}) authenticated via credentials.`
          );

          const { password, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            id: user.id, // Database INTEGER ID
            username: user.username,
            email: user.email,
            image: user.profileImage || null,
          };
        } catch (error) {
          console.error("Credentials Authorization error:", error);
          if (error.message === "Invalid username or password") {
            throw error;
          }
          return null;
        }
      },
    }),
    // Add any other providers here...
  ], // <-- This closing bracket must be here

  callbacks: {
    async session({ session, token }) {
      // ... (Keep this callback as previously corrected) ...
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub, // DB ID (string)
          username: token.username,
          name: token.name || token.username,
          email: token.email,
          image: token.image || null, // Image from token (populated by jwt callback)
        };
      }
      return session;
    },

    async jwt({ token, user, account, profile }) {
      await ensureDbInitialized(); // Call the imported function
      const userRepo = AppDataSource.getRepository(User); // Get repo

      if (user) {
        // Initial sign-in
        let dbUser = null;

        if (account && account.provider === "github") {
          console.log("JWT Callback: Handling GitHub login...");
          const githubUserId = user.id; // GitHub ID string from profile
          const email = user.email;
          const username = user.username;
          const name = user.name;
          const image = user.image; // GitHub avatar_url from profile

          // 1. Find by githubId
          dbUser = await userRepo.findOne({
            where: { githubId: githubUserId },
          });

          if (dbUser) {
            // User found by githubId (returning GitHub user)
            console.log(
              `JWT: Found existing DB user by githubId: ${githubUserId} (DB ID: ${dbUser.id}).`
            );
            // FIX: Update user data from GitHub profile, including image
            // Only update if the image from GitHub is different or not null
            if (image && dbUser.profileImage !== image) {
              console.log("Updating user profile image from GitHub.");
              dbUser.profileImage = image;
              // Save the updated entity
              try {
                await userRepo.save(dbUser);
              } catch (saveError) {
                console.error("Error saving user image update:", saveError);
              }
            }
          } else {
            // 2. Not found by githubId, try by email (linking potential)
            console.log(
              `GitHub user ${githubUserId} not found by githubId. Looking up by email: ${email}`
            );
            dbUser = await userRepo.findOne({ where: { email: email } });

            if (dbUser) {
              // Found user by email. Link this GitHub account if not already linked.
              if (dbUser.githubId === null) {
                console.log(
                  `Linking GitHub ID ${githubUserId} to existing user with email ${email} (ID: ${dbUser.id}).`
                );
                dbUser.githubId = githubUserId;
                dbUser.profileImage = image; // Store image
                // Save the updated user record
                try {
                  await userRepo.save(dbUser);
                } catch (saveError) {
                  console.error("Error saving user linkage/image:", saveError);
                }
              } else {
                console.warn(
                  `User with email ${email} (ID: ${dbUser.id}) already linked to GitHub ID ${dbUser.githubId}. Cannot link to ${githubUserId}. Using existing user.`
                );
              }
            } else {
              // 3. Not found by email, try by username (preventing conflict)
              console.log(
                `GitHub user ${githubUserId} not found by email. Looking up by username: ${username}`
              );
              dbUser = await userRepo.findOne({
                where: { username: username },
              });
              if (dbUser) {
                console.error(
                  `JWT Conflict: Username "${username}" taken by existing user ID ${dbUser.id}. GitHub user ${githubUserId} cannot be linked/created.`
                );
                dbUser = null; // Indicate failure
                // Optional: Throw or return {}
              } else {
                // 4. Not found by anything, safe to create a new user.
                console.log(
                  `Creating new database user for GitHub account ${githubUserId} (${username})...`
                );
                dbUser = userRepo.create({
                  githubId: githubUserId,
                  username: username,
                  email: email,
                  name: name,
                  profileImage: image,
                  password: null,
                });
                try {
                  await userRepo.save(dbUser);
                } catch (saveError) {
                  console.error("Error creating new user:", saveError);
                  dbUser = null; /* Handle potential error on save */
                }
                if (dbUser)
                  console.log(`JWT: New user created with DB ID: ${dbUser.id}`);
              }
            }
          }
        } else {
          // Credentials or other non-GitHub login
          console.log("JWT Callback: Handling non-GitHub login...");
          if (user && user.id) {
            // Assuming user.id is DB ID from authorize
            dbUser = await userRepo.findOne({ where: { id: user.id } });
            if (!dbUser) {
              console.error(
                `JWT Callback: User ID ${user.id} from authorize not found!`
              );
              return {};
            }
            console.log(
              `JWT: Resolved DB user for Credentials login: ${dbUser.username} (ID: ${dbUser.id})`
            );
          } else {
            console.error(
              "JWT Callback: User object missing ID from authorize."
            );
            return {};
          }
        }

        // Populate Token with Database User Data IF dbUser was resolved
        if (dbUser && dbUser.id) {
          console.log(
            `JWT Callback: Populating token with DB user ID: ${dbUser.id}`
          );
          token.sub = dbUser.id.toString(); // Set JWT subject to DB ID (string)
          token.username = dbUser.username;
          token.name = dbUser.name || dbUser.username;
          token.email = dbUser.email;
          token.image = dbUser.profileImage || null; // Get image from the DB user entity
          // Add other fields from dbUser as needed
        } else {
          console.warn(
            "JWT Callback: dbUser not resolved. Token will not contain DB user ID."
          );
        }
      }
      return token; // Return the token
    },
  },
  // You might have other top-level options here like `session`, `debug`, `secret`
  // session: { strategy: "jwt" }, // Make sure this is here if you use JWT sessions
  // secret: process.env.NEXTAUTH_SECRET, // Required for production
};
