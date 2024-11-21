export { default } from "next-auth/middleware";

export const config = {
  pages: {
    signIn: "/auth/login", // Custom sign-in page
  },
  matcher: ["/search", "/cities", "/favorites"],
};
