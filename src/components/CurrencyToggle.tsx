import React from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { useCurrency } from "@/hooks/CurrencyContext";
import { NairaSign } from "./ui/NairaSign";

const CurrencyToggle: React.FC = () => {
  const { currency, toggleCurrency } = useCurrency();
  const isNaira = currency === "NGN";

  const USD_RATE = Number(import.meta.env.VITE_USD_RATE) || 1505;
  const brandColor = "#ffa30f";

  return (
    <div className="flex justify-end">
      <motion.button
        type="button"
        onClick={toggleCurrency}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-between w-32 h-9 rounded-full border border-gray-300 shadow-md overflow-hidden text-xs"
        style={{
          background: "linear-gradient(145deg, #fff, #f9f9f9)",
        }}
      >
        {/* 🟠 Sliding Switcher (BTM Brand Color) */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`absolute top-[2px] bottom-[2px] w-[48%] rounded-full shadow-md ${
            isNaira ? "left-[2px]" : "right-[2px]"
          }`}
          style={{
            background: `linear-gradient(145deg, ${brandColor}, #e08500)`,
          }}
        />

        {/* 💰 Currency Options */}
        <div className="flex justify-between w-full px-3 z-10 font-medium">
          {/* NGN side */}
          <div
            className={`flex items-center gap-1 transition-colors ${
              isNaira ? "text-white" : "text-gray-700"
            }`}
          >
            <NairaSign className="w-3.5 h-3.5" />
            <span>NGN</span>
          </div>

          {/* USD side */}
          <div
            className={`flex items-center gap-1 transition-colors ${
              !isNaira ? "text-white" : "text-gray-700"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>USD</span>
          </div>
        </div>

        {/* ✨ Subtle Orange Glow */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            boxShadow: `0 0 10px 1px ${
              isNaira ? "rgba(255,163,15,0.5)" : "rgba(255,163,15,0.5)"
            }`,
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        {/* 🔄 Exchange Rate Label */}
        <motion.span
          key={isNaira ? "naira" : "usd"}
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[11px] text-gray-500"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isNaira
            ? `1$ ≈ ₦${USD_RATE.toLocaleString()}`
            : `₦${USD_RATE.toLocaleString()} ≈ 1$`}
        </motion.span>
      </motion.button>
    </div>
  );
};

export default CurrencyToggle;
