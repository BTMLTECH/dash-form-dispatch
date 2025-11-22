import React, { useState, useEffect } from "react"; 
import { api } from "@/lib/api";
import DiscountCreateForm from "./DiscountCreateForm";
import { toast } from "@/components/ui/use-toast"; // adjust import to your toast hook

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = { token };
      const response = await api.submitCustomerDetails( payload , "verify");

      if (response.success) {
        setIsLoggedIn(true);
        toast({
          title: "Session Restored",
          description: "You are already logged in.",
        });
      } else {
        localStorage.removeItem("token");
        toast({
          title: "Session Expired",
          description: "Please login again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      localStorage.removeItem("token");
      toast({
        title: "Server Error",
        description: "Could not verify session. Please login again.",
        variant: "destructive",
      });
    }
  };

  verifyToken();
}, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
       const payload = { 
          email: email.toLowerCase(), 
          password 
        };
      const response = await api.submitCustomerDetails(payload, "login");

      if (response.success) {
        // store token
        localStorage.setItem("token", response.token);

        toast({
          title: "Login Successful",
          description: response.message || "Welcome back, Admin!",
        });

        setEmail("");
        setPassword("");
        setIsLoggedIn(true);
      } else {
        toast({
          title: "Login Failed",
          description: response.error || response.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Server Error",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full border rounded-lg p-2 focus:ring focus:ring-primary/30"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full border rounded-lg p-2 focus:ring focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <DiscountCreateForm />;
}
