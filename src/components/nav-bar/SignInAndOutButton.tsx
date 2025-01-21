"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import TransitionLink from "../utils/TransitionLink";

const SignInAndOutButton: React.FC = (): React.JSX.Element => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
            Logout
          </Button>
          <button className="ml-2 w-8 h-8 flex justify-center items-center rounded-full">
            <Link href="/user">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              ) : (
                <FaUserCircle className="w-6 h-6" />
              )}
            </Link>
          </button>
        </div>
      ) : (
        <TransitionLink href="/login">
          <Button variant="ghost">Login</Button>
        </TransitionLink>
      )}
    </>
  );
};

export default SignInAndOutButton;
