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

  const onLogin = async () => {
    try {
      setLoading(true);

  const res = await axios.post<LoginResponse>("/api/users/login", user, 
      {withCredentials: true

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
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">
        {loading ? "Processing" : "Login"}
      </h1>

      {/* Email Field */}
      <label htmlFor="email" className="mb-1 text-sm text-gray-300">
        Email
      </label>
      <input
        type="email"
        className="p-2 mb-4 w-64 rounded bg-gray-800 text-white"
        placeholder="Enter your email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      {/* Password Field */}
      <label htmlFor="password" className="mb-1 text-sm text-gray-300">
        Password
      </label>
      <input
        type="password"
        className="p-2 mb-4 w-64 rounded bg-gray-800 text-white"
        placeholder="Enter your password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />

      <button
        onClick={onLogin}
        className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="mt-4 text-sm text-gray-400">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-400 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
