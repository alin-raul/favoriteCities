"use client"; // This makes this component a Client Component

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function handleLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [callbackUrl, setCallbackUrl] = useState("/"); // Default callbackUrl
  const router = useRouter();

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

  const handleGitHubLogin = () => {
    signIn("github", { callbackUrl }).then((result) => {
      if (result?.error) {
        setError("GitHub login failed: " + result.error);
      } else {
        // Successful login, redirect to callbackUrl or home
        router.push(callbackUrl || "/");
      }
    });
  };

  return (
    <div className="flex justify-center items-center p-4 bg-dynamic rounded-2xl w-72 mt-6 shadow-md">
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-center font-bold">Sign In</h1>

        {/* Credentials Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 rounded border"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded border"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded">
            Sign In
          </button>
        </form>

        {/* GitHub Login Button */}
        <button
          onClick={handleGitHubLogin}
          className="bg-black text-white py-2 rounded mt-4"
        >
          Sign In with GitHub
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
