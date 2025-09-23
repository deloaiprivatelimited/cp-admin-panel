import React from "react";

const Footer = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full bg-white border-t border-gray-200 shadow-sm p-4 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export default Footer;
