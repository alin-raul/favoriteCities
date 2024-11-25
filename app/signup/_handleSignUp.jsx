"use client";

import React, { useState, useEffect } from "react";
import CustomForm from "@/components/form/customForm";

const HandleSignUp = () => {
  const [error, setError] = useState(null);
  const [callbackUrl, setCallbackUrl] = useState("/login");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCallback = urlParams.get("callbackUrl");
    if (urlCallback) {
      setCallbackUrl(urlCallback);
    }
  }, []);

  const handleSignup = async (formData) => {
    console.log(formData);

    const { username, email, password } = formData;

    try {
      // Replace with actual signup API call
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Signup failed: ${errorData.message}`);
      }

      console.log("User created");

      window.location.href = callbackUrl;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CustomForm
      onSubmit={handleSignup}
      error={error}
      placeholders={["Username", "Email", "Password"]}
      inputTypes={["text", "text", "password"]}
      fieldNames={["username", "email", "password"]}
      redirectUrl="/login"
      title="Create Account"
      redirectText="Already have an account?"
      buttonText="Sign Up"
      linkText="Login"
    />
  );
};

export default HandleSignUp;
