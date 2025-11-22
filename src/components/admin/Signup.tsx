import React, { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function SignupForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await api.submitCustomerDetails(form, "signup");
    if (response.success) {
  
      localStorage.setItem("token", response.token);

      // Show success toast
      toast({
        title: "Signup Successful",
        description: response.message || "Your account has been created successfully.",
      });

      // Reset form
      setForm({ email: "", password: "" });
    } else {
      // Show error toast
      toast({
        title: "Signup Failed",
        description: response.error || response.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    toast({
      title: "Server Error",
      description: "Could not connect to the server.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white border border-gray-200 shadow-md rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Signup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <input
            type="submit"
            value={loading ? "Signing up..." : "Signup"}
            disabled={loading}
            className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer disabled:opacity-50"
          />
        </form>
      </div>
    </div>
  );
}
