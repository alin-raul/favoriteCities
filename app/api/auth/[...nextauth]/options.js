import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
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
          placeholder: "cool-username",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = {
          id: "6",
          name: "Raul",
          username: "cool-username",
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
