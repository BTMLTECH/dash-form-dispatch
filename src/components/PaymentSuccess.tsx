import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import Spinner from "./ui/Spinner";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setError("No payment reference found.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const data = await api.verifyPayment(reference);

        if (data.success && data.payment) {
          setPayment(data.payment); // Store the whole payment object
        } else {
          setError("Payment could not be verified or not found.");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError("Error verifying payment. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <Spinner size="w-12 h-12" />
        <p className="mt-4 text-green-700 font-medium">
          Verifying your payment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4">
        <XCircle className="text-red-600 w-16 h-16 mb-4" />
        <p className="text-red-700 font-semibold mb-4">{error}</p>
        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  const customerName = payment.fullName || "Customer";
  const customerEmail = payment.email || "your email";
  const totalAmount = payment.totalPrice || 0;
  const currencySymbol = payment.currency === "USD" ? "$" : "₦";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <CheckCircle className="text-green-600 w-20 h-20 mb-6" />
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-700 text-center max-w-md mb-6">
        Thank you, <strong>{customerName}</strong>! <br />
        Your payment of{" "}
        <strong>
          {currencySymbol}
          {totalAmount.toLocaleString()}
        </strong>{" "}
        has been confirmed.
        <br />
        A confirmation email has been sent to <strong>{customerEmail}</strong>.
      </p>

      <Link
        to="/"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
