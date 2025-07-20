// ✅ This is the unified profile page.
// 🔒 Deprecated use of dynamic route `/profile/[id]` for now — retained for future admin features.
// 🔗 Any navigation or logic tied to dynamic `?id=` or `/profile/[id]` has been removed or commented.

"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/users/me", {
          withCredentials: true,
        });
        setName(data.name);
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

  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setConfirming(true);
  };

  const proceedDownload = () => {
    setConfirming(false);
    window.location.href = "/test/test-resources.tar";
  };

  const cancelDownload = () => {
    setConfirming(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <hr className="w-1/2 border-gray-700 mb-6" />

      <p className="text-3xl font-light mb-4">
        Welcome back, {name || "loading"}!
      </p>

      <section className="bg-gray-800 p-6 rounded-xl mt-6 shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">🧪 Test Resources</h2>
        <p className="mb-4">
          Download a <code>.tar</code> archive containing sample CSVs, test images, and documentation for uploading test cases in WSL2 environments.
        </p>
        <button
          onClick={handleDownloadClick}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          📦 Download test-resources.tar
        </button>
        <p className="text-sm mt-2 text-gray-400">
          For development use only. Do not use with real patient data.
        </p>
      </section>

      {confirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm">
            <p className="mb-4">
              ⚠️ You’re about to download test files for development purposes. Proceed at your own risk.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDownload}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={proceedDownload}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={logout}
        className="bg-blue-500 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
