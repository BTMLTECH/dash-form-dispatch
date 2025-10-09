// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_BASE;
// const API_BASE = "";

export const api = {
  initiatePayment: async (payload: FormData) => {
    const res = await fetch(`${API_BASE}/initiate-payment`, {
      method: "POST",
      body: payload,
    });
    return res.json();
  },

  verifyPayment: async (reference: string) => {
    const res = await fetch(
      `${API_BASE}/verify-payment?reference=${reference}`
    );
    return res.json();
  },

  submitCustomerDetails: async (data: any, url: string) => {
    const res = await fetch(`${API_BASE}/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
