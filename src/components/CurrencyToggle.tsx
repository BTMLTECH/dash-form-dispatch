// import React from "react";
// import { motion } from "framer-motion";
// import { DollarSign } from "lucide-react";
// import { useCurrency } from "@/hooks/CurrencyContext";
// import { NairaSign } from "./ui/NairaSign";

// const CurrencyToggle: React.FC = () => {
//   const { currency, toggleCurrency } = useCurrency();
//   const isNaira = currency === "NGN";

//   return (
//     <div className="flex justify-end">
//       <motion.button
//         type="button"
//         onClick={toggleCurrency}
//         whileHover={{ scale: 1.06 }}
//         whileTap={{ scale: 0.96 }}
//         transition={{ type: "spring", stiffness: 300, damping: 20 }}
//         className="relative flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 shadow-md bg-white overflow-hidden"
//         style={{
//           background: "linear-gradient(145deg, #fff, #f7f7f7)",
//         }}
//       >
//         {/* 🔥 Animated glow ring */}
//         <motion.div
//           className="absolute inset-0 rounded-full pointer-events-none"
//           animate={{
//             boxShadow: isNaira
//               ? "0 0 15px 2px rgba(232, 103, 0, 0.4)"
//               : "0 0 15px 2px rgba(80, 80, 80, 0.4)",
//             scale: [1, 1.04, 1],
//           }}
//           transition={{
//             duration: 1.4,
//             repeat: Infinity,
//             repeatType: "mirror",
//           }}
//         />

//         {isNaira ? (
//           <>
//             <NairaSign className="w-5 h-5 text-[var(--brand-color)] relative z-10" />
//             <span className="font-semibold text-gray-800 relative z-10">
//               Paying in Naira
//             </span>
//           </>
//         ) : (
//           <>
//             <DollarSign className="w-5 h-5 text-gray-700 relative z-10" />
//             <span className="font-semibold text-gray-800 relative z-10">
//               Paying in USD
//             </span>
//           </>
//         )}
//       </motion.button>
//     </div>
//   );
// };

// export default CurrencyToggle;

import React from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { useCurrency } from "@/hooks/CurrencyContext";
import { NairaSign } from "./ui/NairaSign";

const CurrencyToggle: React.FC = () => {
  const { currency, toggleCurrency } = useCurrency();
  const isNaira = currency === "NGN";

  const USD_RATE = Number(import.meta.env.VITE_USD_RATE) || 1505;

  return (
    <div className="flex justify-end">
      <motion.button
        type="button"
        onClick={toggleCurrency}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 shadow-sm bg-white overflow-hidden text-sm"
        style={{
          background: "linear-gradient(145deg, #fff, #f8f8f8)",
        }}
      >
        {/* ✨ Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            boxShadow: isNaira
              ? "0 0 10px 2px rgba(232,103,0,0.3)"
              : "0 0 10px 2px rgba(50,50,50,0.3)",
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        {/* 💰 Icon + Label */}
        {isNaira ? (
          <>
            <NairaSign className="w-4 h-4 text-[var(--brand-color)] relative z-10" />
            <span className="relative z-10">NGN</span>
          </>
        ) : (
          <>
            <DollarSign className="w-4 h-4 text-gray-700 relative z-10" />
            <span className="relative z-10">USD</span>
          </>
        )}

        {/* 🔄 Exchange Rate */}
        <motion.span
          key={isNaira ? "naira" : "usd"}
          className="text-[12px] text-gray-500 ml-1 relative z-10"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
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
