import bcrypt from "bcrypt";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AppDataSource } from "@/app/database/data-source";
import { User } from "@/app/entity/User";

export const options = {
  pages: {
    signIn: "/login",
  },
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
        try {
          await AppDataSource.initialize();

          const userRepo = AppDataSource.getRepository(User);

          const user = await userRepo.findOne({
            where: { username: credentials?.username },
          });

          if (!user) {
            throw new Error("Invalid username or password");
          }
          const isPasswordValid = await bcrypt.compare(
            credentials?.password,
            user.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid username or password");
          }

          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message || "An unexpected error occurred");
        }
      },
    }),
  ],
};
