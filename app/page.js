import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/home");
  }

  return (
    <div className="flex justify-center align-center p-4 bg-dynamic rounded-2xl w-72 mt-6 shadow-md">
      <div className="flex flex-col gap-2 ">
        <h1>
          Welcome back, <span className="font-bold">{session.user.name}</span>
        </h1>
        <p>Email: {session.user.email}</p>
      </div>
    </div>
  );
}
