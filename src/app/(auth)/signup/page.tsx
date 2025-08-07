"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { errorMonitor } from "events";


// ✅ Removed unused imports: axios, UNDERSCORE_NOT_FOUND_ROUTE

export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true); // default: true
  const [loading, setLoading] = useState(false);

  // ✅ useEffect must be called at the top level (not inside onSignup)


  useEffect(() => {
    const isFormComplete =
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0;

    setButtonDisabled(!isFormComplete);
  }, [user]);

        // update to code from video

const onSignup = async () => {
  console.log("Submitting user:", user);

  try {
    setLoading(true);
    const response = await axios.post("/api/auth/signup", user);
    console.log("Signup success", response.data);
    toast.success("Signup successful!");
    router.push("/login");



} catch (error: any) {
  // Optional: comment out or remove for production
  //console.error("Signup failed:", error?.response?.data?.message || error.message);

  // Show friendly error to the user
  const backendMessage =
    error?.response?.data?.message ||
    "Signup failed. Please try again.";

  toast.error(backendMessage);

} finally {
    setLoading(false);
  }
};


//end update here

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-black text-white">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">{loading ? "Processing" : "Signup"}</h1>

      {/* Username Input */}
      <label htmlFor="username" className="mb-1 text-sm text-gray-300">
        Username
      </label>
      <input
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="Enter your username"
        className="p-2 w-72 bg-white text-gray-800 border border-gray-300 rounded-lg mb-4"
      />

      {/* Email Input */}
      <label htmlFor="email" className="mb-1 text-sm text-gray-300">
        Email
      </label>
      <input
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Enter your email"
        className="p-2 w-72 bg-white text-gray-800 border border-gray-300 rounded-lg mb-4"
      />

      {/* Password Input */}
      <label htmlFor="password" className="mb-1 text-sm text-gray-300">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Enter your password"
        className="p-2 w-72 bg-white text-gray-800 border border-gray-300 rounded-lg mb-6"
      />

      {/* Signup Button */}
      <button
        onClick={onSignup}
        disabled={buttonDisabled || loading}
        className={`p-2 w-72 border rounded-lg mb-4 transition ${
          buttonDisabled || loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-black text-white border-white hover:bg-white hover:text-black"
        }`}
      >
        {loading 
        ? "Signing up..." 
        :buttonDisabled
        ? "No Signup"
        : "Signup here"}
      </button>

      {/* Link to Login Page */}
      <Link
        href="/login"
        className="text-sm text-gray-400 hover:text-white underline"
      >
        Visit Login Page
      </Link>
    </div>
  );
}
