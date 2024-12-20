import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Wrapper from "@/components/pageWrapper/wrapper";
import HandleLogout from "../login/_handleLogout";
import Image from "next/image";

export default async function User() {
  const session = await getServerSession(options);

  return (
    <Wrapper className="h-screen-minus-nav flex flex-col justify-center items-center">
      <div className="h-fit w-96 p-8 bg-dynamic rounded-2xl shadow-md">
        <div className="flex flex-col gap-4">
          <div>
            <Image
              src={session.user.image}
              alt="Avatar"
              width={200}
              height={200}
              className="rounded-full shadow-lg m-auto"
            />
            <h2 className="font-bold text-2xl text-center mt-2">
              {session.user.name}
            </h2>
            <h3 className="text-center">{`${
              session.user.email ? session.user.email : ""
            }`}</h3>
          </div>
          <span>You are already logged in.</span>
          <span className="text-center opacity-60 mt-8 text-sm">
            Do you want to logout?
          </span>
          <HandleLogout />
        </div>
      </div>
    </Wrapper>
  );
}
