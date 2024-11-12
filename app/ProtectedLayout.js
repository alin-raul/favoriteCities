import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RootLayout from "./layout";

export default async function ProtectedLayout({ children }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  return <RootLayout session={session}>{children}</RootLayout>;
}
