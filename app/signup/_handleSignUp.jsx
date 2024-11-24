"use client";

import React, { useState, useEffect } from "react";
import CustomForm from "@/components/form/customForm";

const HandleSignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [callbackUrl, setCallbackUrl] = useState("/"); // Default callbackUrl

  // Use useEffect to get the callbackUrl from the query parameter after the component is mounted
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCallback = urlParams.get("callbackUrl");
    if (urlCallback) {
      setCallbackUrl(urlCallback);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    // Call the signIn function with the credentials
    const result = await signIn("credentials", {
      redirect: false,
      username, // Send the username to credentials provider
      password, // Send the password to credentials provider
    });

    if (result?.error) {
      setError(result.error);
    } else {
      // Redirect to the callbackUrl or default to the homepage
      router.push(callbackUrl);
    }
  };

  return (
    <CustomForm
      onSubmit={handleLogin}
      values={{ username, password }}
      error={error}
      placeholders={["Username", "Password"]}
      inputTypes={["text", "password"]}
      fieldNames={["username", "password"]}
      redirectUrl="/login"
      title="Sign up"
      redirectText="Already have an account?"
      buttonText="Sign Up"
      linkText="Login"
    />
  );
};

export default HandleSignUp;
