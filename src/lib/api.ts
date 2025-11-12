// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_BASE;
// const API_BASE = "";
export const api = {
  initiatePayment: async (payload: FormData) => {
    try {
      const res = await fetch(`${API_BASE}/initiate-payment`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP Error ${res.status}`);
      }

      return await res.json();
    } catch (error: any) {
      return { success: false, error: error.message || "Network error" };
    }
  },

  verifyPayment: async (reference: string) => {
    try {
      const res = await fetch(`${API_BASE}/verify-payment?reference=${reference}`);

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP Error ${res.status}`);
      }

      return await res.json();
    } catch (error: any) {
      return { success: false, error: error.message || "Network error" };
    }
  },

    submitCustomerDetails: async (data: any, url: string, timeoutMs = 10000) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(`${API_BASE}/${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        // Try parsing JSON safely
        let result: any;
        try {
          result = await response.json();
        } catch {
          const text = await response.text();
          throw new Error(`Invalid JSON response: ${text}`);
        }

        // Handle non-success HTTP codes
        if (!response.ok) {
          const message =
            result?.message || `Server returned ${response.status} ${response.statusText}`;
          throw new Error(message);
        }

        return result;
      } catch (error: any) {
        clearTimeout(timeout);

        let message = "Network request failed. Please check your internet connection.";

        if (error.name === "AbortError") {
          message = "⏱️ Request timed out. Please try again later.";
        } else if (error?.message?.includes("Failed to fetch")) {
          message = "🌐 Unable to connect to the server. Please check your network or VPN.";
        } else if (error?.message) {
          message = error.message;
        }


        return {
          success: false,
          message,
        };
      }
    },

};
