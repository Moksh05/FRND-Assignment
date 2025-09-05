import React from "react";
import { Truck, Globe, Activity, BarChart2, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

// Header Component
const Header = () => {
  const rightIcons = [Globe, Activity, BarChart2, Users];

  return (
    <header className="w-full sticky top-0 z-50 bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-5 px-4 md:px-6">
        {/* Left side: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-2 flex items-center justify-center shadow-md">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Logistics<span className="text-purple-300">Optimizer</span>
          </h1>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-4">
          {[
            { name: "Upload", path: "/" },
            { name: "Dashboard", path: "/dashboard" },
          ].map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              className={({ isActive }) =>
                `relative text-sm md:text-base font-medium transition px-3 py-2 rounded-lg ${
                  isActive
                    ? "text-purple-200 font-semibold bg-purple-700/20 shadow-lg"
                    : "text-white/80 hover:text-purple-200 hover:bg-white/10"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right side: Icons */}
        <div className="flex items-center gap-2 md:gap-3">
          {rightIcons.map((Icon, idx) => (
            <button
              key={idx}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition shadow-sm"
            >
              <Icon className="w-5 h-5 text-purple-200" />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
