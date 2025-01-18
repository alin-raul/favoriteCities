"use server";

import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";

const Login: React.FC = () => {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <h1>Welcome back</h1>
      ) : (
        <>
          <h1>Not logged in</h1>
          <Button onClick={() => signIn("github")}>Log in</Button>
        </>
      )}
    </>
  );
};

export default Login;
