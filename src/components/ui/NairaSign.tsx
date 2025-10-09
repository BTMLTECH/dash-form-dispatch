import React from "react";

export const NairaSign = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    stroke="currentColor"
    strokeWidth="16"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="40" y1="96" x2="216" y2="96" />
    <line x1="40" y1="160" x2="216" y2="160" />
    <line x1="88" y1="40" x2="88" y2="216" />
    <line x1="168" y1="40" x2="168" y2="216" />
    <polyline points="88 96 168 160" />
    <polyline points="168 96 88 160" />
  </svg>
);
