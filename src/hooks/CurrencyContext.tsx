import React, { createContext, useContext, useState } from "react";

type Currency = "NGN" | "USD";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>("NGN");

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "NGN" ? "USD" : "NGN"));
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, setCurrency }}>
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
