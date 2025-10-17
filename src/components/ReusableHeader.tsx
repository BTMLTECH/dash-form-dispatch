import React from "react";
import { motion } from "framer-motion";

interface ReusableHeaderProps {
  title: string;
  description: string;
  logoSrc?: string;
  altText?: string;
}

const ReusableHeader: React.FC<ReusableHeaderProps> = ({
  title,
  description,
  logoSrc = "/assets/btm.png",
  altText = "BTM Logo",
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex flex-col items-center text-center mb-10 rounded-2xl border border-[var(--brand-border)] 
                 bg-gradient-to-b from-[var(--brand-light)] to-white shadow-md p-8 backdrop-blur-sm"
    >
      {/* Logo and Title Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-3">
        {logoSrc && (
          <motion.img
            src={logoSrc}
            alt={altText}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="h-16 w-auto drop-shadow-md"
          />
        )}

        <div className="text-left max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {title}
          </h1>

          <p className="mt-2 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>

      {/* Accent Divider Line */}
      <div className="w-24 h-[3px] bg-gradient-to-r from-[var(--brand-color)] via-amber-400 to-[var(--brand-dark)] rounded-full mt-3"></div>

      {/* Subtle Light Overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            "0 0 0px rgba(255,255,255,0.0)",
            "0 0 40px rgba(255, 215, 160, 0.25)",
            "0 0 0px rgba(255,255,255,0.0)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
    </motion.header>
  );
};

export default ReusableHeader;
