import React, { createContext, useContext, useState, useMemo } from "react";

type Currency = "NGN" | "USD";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
  convert: (amount: number, from?: Currency, to?: Currency) => number;
  format: (amount: number, from?: Currency, to?: Currency) => string;
  rate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>("NGN");

  // 🧾 Use rate from .env or default
  const rate = Number(import.meta.env.VITE_USD_RATE) || 1600;

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "NGN" ? "USD" : "NGN"));
  };

  /** 💰 Convert helper */
  const convert = (
    amount: number,
    from: Currency = "NGN",
    to: Currency = currency
  ): number => {
    if (from === to) return amount;

    if (from === "NGN" && to === "USD") {
      return amount / rate;
    }

    if (from === "USD" && to === "NGN") {
      return amount * rate;
    }

    return amount;
  };

  /** 💅 Format helper (auto adds ₦ / $) */
  const format = (
    amount: number,
    from: Currency = "NGN",
    to: Currency = currency
  ): string => {
    const converted = convert(amount, from, to);
    if (to === "NGN") {
      return `₦${Math.round(converted).toLocaleString()}`;
    } else {
      return `$${converted.toFixed(2)}`;
    }
  };

  const value = useMemo(
    () => ({
      currency,
      toggleCurrency,
      setCurrency,
      convert,
      format,
      rate,
    }),
    [currency, rate]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
