"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UserProfile() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ Needed to access query params
  const id = searchParams.get("id");      // ✅ Grab `id` from ?id=XYZ

  const logout = async () => {
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <hr className="w-1/2 border-gray-700 mb-6" />
      <p className="text-3xl font-light mb-4">
        Welcome to your profile page!
      </p>

      {/* ✅ Show ID if available */}
      {id && (
        <span className="inline-block mb-4 px-4 py-2 bg-green-400 text-black font-mono font-bold rounded-lg shadow-lg">
          User ID: {id}
        </span>
      )}

      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
