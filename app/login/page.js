import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HandleLogin from "./_handleLogin";

export default async function Login() {
  const session = await getServerSession(options);

  if (!session) {
    return <HandleLogin />;
  }

  return (
    <>
      <div className="flex justify-center align-center p-4 bg-dynamic rounded-2xl w-fit mt-6 shadow-md">
        <div className="flex flex-col gap-2 ">
          <h1>
            You are already logged in,{" "}
            <span className="font-bold">{session.user.name}</span>
          </h1>
          {session.user.email ? <p>Email: {session.user.email}</p> : null}
        </div>
      </div>
    </>
  );
}
