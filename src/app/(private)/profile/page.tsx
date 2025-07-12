"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/users/me", {
          withCredentials: true,
        });
        setName(data.name); // ✅ Set name from the JWT
      } catch (error) {
        toast.error("Please log in first.");
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.error(error?.response?.data || error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <hr className="w-1/2 border-gray-700 mb-6" />

      <p className="text-3xl font-light mb-4">
        Welcome back, {name || "loading"}!
      </p>

      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
