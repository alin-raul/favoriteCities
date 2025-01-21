"use client";

import React, { useState, useEffect } from "react";
import CustomForm from "@/components/form/customForm";

const HandleSignUp: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState<string>("/login");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCallback = urlParams.get("callbackUrl");
    if (urlCallback) {
      setCallbackUrl(urlCallback);
    }
  }, []);

  const handleSignup = async (formData: Record<string, string>) => {
    const { username, email, password } = formData;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);

        if (
          errorData.error ===
          "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email"
        ) {
          throw new Error(`Email already exists`);
        } else if (
          errorData.error ===
          "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username"
        ) {
          throw new Error(`Username already exists`);
        } else {
          throw new Error(errorData.error);
        }
      }

      window.location.href = callbackUrl;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <CustomForm
      onSubmit={handleSignup}
      error={error}
      placeholders={["Username", "Email", "Password", "Confirm Password"]}
      inputTypes={["text", "text", "password", "password"]}
      fieldNames={["username", "email", "password", "confirm-password"]}
      redirectUrl="/login"
      title="Create Account"
      redirectText="Already have an account?"
      buttonText="Sign Up"
      linkText="Login"
      formType="signup"
    />
  );
};

export default HandleSignUp;
