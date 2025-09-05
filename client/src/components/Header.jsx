import React from "react";
import { Truck, Globe, Activity, BarChart2, Users } from "lucide-react";

// Header Component
const Header = () => {
  // Icons for the right side
  const rightIcons = [Globe, Activity, BarChart2, Users];

  return (
    <header className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        {/* Left side: Icon + Title */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-white bg-opacity-20 rounded-full p-2 flex items-center justify-center">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-wide">
            Logistics Optimizer
          </h1>
        </div>

        {/* Right side: Icons */}
        <div className="flex items-center gap-3">
          {rightIcons.map((Icon, idx) => (
            <div
              key={idx}
              className="bg-white bg-opacity-20 rounded-full p-2 flex items-center justify-center hover:bg-opacity-40 transition"
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
