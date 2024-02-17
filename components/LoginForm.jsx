"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!email && !password) {
        setError("Please fill out all fields");
        return;
      }
      if (!email) {
        setError("Email field is empty");
        return;
      }
      if (!password) {
        setError("Password field is empty");
        return;
      }
      if (res.error) {
        setError("Incorect credentials");
        return;
      }
      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-10 rounded-lg border-y-4 border-gray-800">
        <h1 className="text-xl font-bold pb-10 AdminLogin">Dashboard login:</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
          <input
            onChange={e => {
              setEmail(e.target.value.toLowerCase().replace(/\s+$/, ""));
              setError("");
            }}
            type="text"
            placeholder="Email"
            className="md:w-96"
          />
          <input
            onChange={e => {
              setPassword(e.target.value);
              setError("");
            }}
            type="password"
            placeholder="Password"
            className="md:w-96"
          />

          <button className="bg-gray-800 text-white font-bold cursor-pointer px-6 py-3 mt-0"> Login</button>
          {error && <div className="bg-red-500 text-white w-auto text-sm py-3 px-3 rounded-md mt-0 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}
