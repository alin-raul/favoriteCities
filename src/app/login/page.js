import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import HandleLogin from "./_handleLogin";
import Wrapper from "@/components/pageWrapper/wrapper";
import HandleLogout from "./_handleLogout";

export default async function Login() {
  const session = await getServerSession(options);

  if (!session) {
    return <HandleLogin session={session} />;
  }

  return (
    <Wrapper className="h-screen-minus-nav flex flex-col justify-center items-center">
      <div className="h-fit p-4 bg-dynamic rounded-2xl w-fit shadow-md">
        <div className="flex flex-col gap-4">
          <span>
            You are already logged in,{" "}
            <span className="font-bold">{session.user.name}.</span>
          </span>{" "}
          {session.user.email ? <p>Email: {session.user.email}</p> : null}
          <span className="text-center opacity-60 mt-8 text-sm">
            Do you want to logout?
          </span>
          <HandleLogout />
        </div>
      </div>
    </Wrapper>
  );
}
