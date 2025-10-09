// src/components/ui/Spinner.tsx
import React from "react";

const Spinner: React.FC<{ size?: string }> = ({ size = "w-8 h-8" }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-4 border-gray-300 border-t-green-600 ${size}`}
      />
    </div>
  );
};

export default Spinner;
