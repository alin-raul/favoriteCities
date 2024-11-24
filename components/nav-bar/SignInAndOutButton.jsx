"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

const SignInAndOutButton = ({ session }) => {
  return (
    <>
      {session ? (
        <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </Button>
      ) : (
        <Button variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </>
  );
};

export default SignInAndOutButton;
