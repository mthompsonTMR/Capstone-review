"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  interface LoginResponse {
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  }

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post<LoginResponse>("/api/users/login", user, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const userId = res.data.user?.id;
        router.push(`/profile?id=${userId}`);
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-black text-white">
      <h1 className="text-2xl font-semibold mb-6">
        {loading ? "Processing" : "Login"}
      </h1>

      <form
        onSubmit={onLogin}
        autoComplete="off"
        className="flex flex-col items-center"
      >
        {/* Optional: dummy fields to fool browser */}
        <input type="text" name="fakeuser" autoComplete="username" hidden />
        <input type="password" name="fakepass" autoComplete="new-password" hidden />

        <label htmlFor="email" className="mb-1 text-sm text-gray-300">
          Email
        </label>
        <input
          type="email"
          name="email"
          autoComplete="off"
          className="p-2 mb-4 w-64 rounded bg-gray-800 text-white"
          placeholder="Enter your email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <label htmlFor="password" className="mb-1 text-sm text-gray-300">
          Password
        </label>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          className="p-2 mb-4 w-64 rounded bg-gray-800 text-white"
          placeholder="Enter your password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-400">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-400 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
