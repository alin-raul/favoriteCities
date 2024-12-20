"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";

const SignInAndOutButton = ({ session }) => {
  return (
    <>
      {session ? (
        <div className="flex items-center ">
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
            Logout
          </Button>
          <button className="ml-2 w-8 h-8flex justify-center items-center rounded-full">
            <Link href="/user">
              {session.user.image ? (
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
        <Button variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </>
  );
};

export default SignInAndOutButton;
