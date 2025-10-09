import React from "react";

import { DollarSign } from "lucide-react";
import { useCurrency } from "@/hooks/CurrencyContext";
import { NairaSign } from "./ui/NairaSign";

const CurrencyToggle: React.FC = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={toggleCurrency}
        className="flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gray-50 transition"
      >
        {currency === "NGN" ? (
          <>
            <NairaSign className="w-4 h-4 text-primary" />
            <span>Paying in Naira</span>
          </>
        ) : (
          <>
            <DollarSign className="w-4 h-4 text-primary" />
            <span>Paying in USD</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CurrencyToggle;
