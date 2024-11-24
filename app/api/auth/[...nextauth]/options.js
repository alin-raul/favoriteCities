import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  pages: {
    signIn: "/login", // Custom sign-in page URL
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
  pages: {
    signIn: "/login", // Custom sign-in page
  },
};
