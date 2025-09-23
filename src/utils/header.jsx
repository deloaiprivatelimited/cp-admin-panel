import React from "react";

const Header = ({ heading = "", buttons = [], children, className = "" }) => {
  return (
    <div
      className={`w-full bg-white border-b border-gray-200 shadow-sm p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top row: heading + right buttons */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {heading}
          </h1>

          <div className="flex gap-3">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  btn.variant === "primary"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Children (filters, search bar, etc.) */}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
};

export default Header;
