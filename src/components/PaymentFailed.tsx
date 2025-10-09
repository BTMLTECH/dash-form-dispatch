import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Spinner from "./ui/Spinner";
import { api } from "@/lib/api";

const PaymentFailed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (reference) {
      api
        .verifyPayment(reference)
        .then((data) => {
          if (data.success) {
            setPayment(data.payment);
          }
        })
        .catch((err) => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
        <Spinner size="w-12 h-12" />
        <p className="mt-4 text-red-700 font-medium">
          Checking payment status...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4">
      <XCircle className="text-red-600 w-20 h-20 mb-6" />
      <h1 className="text-2xl font-bold text-red-700 mb-2">
        Payment Failed ❌
      </h1>
      <p className="text-gray-700 text-center max-w-md mb-6">
        Unfortunately, your payment could not be processed. Please try again or
        contact support if the issue persists.
      </p>

      {payment && (
        <p className="text-gray-500 text-sm mb-4">
          Reference: <strong>{payment.reference}</strong>
        </p>
      )}

      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Try Again
      </Link>
    </div>
  );
};

export default PaymentFailed;
