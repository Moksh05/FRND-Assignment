// src/components/CompanyCard.jsx
import React, { useState } from "react";
import TruckCard from "./TruckCard";
import { Truck, DollarSign, ChevronDown, ChevronUp } from "lucide-react";

const CompanyCard = ({ companyName, companyData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate utilization percentage
  const utilization = (companyData.trucksUsed / companyData.originalTruckCount) * 100;

  return (
    <div className="border border-purple-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 bg-white cursor-pointer">
      
      {/* Header */}
      <div
        className="flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="bg-purple-100 rounded-full p-3 flex items-center justify-center">
            <Truck className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-purple-700">{companyName}</h2>
            <div className="flex flex-wrap gap-4 mt-1 text-gray-600">
              <span>
                Trucks Used:{" "}
                <span
                  className={`font-medium ${utilization >= 80 ? "text-green-600" : "text-red-600"}`}
                >
                  {companyData.trucksUsed} / {companyData.originalTruckCount} ({utilization.toFixed(0)}%)
                </span>
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-500" />
                Cost: <span className="font-medium">${companyData.cost.toFixed(2)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="text-purple-500">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="mt-5 space-y-3 bg-purple-50 p-4 rounded-xl transition-all duration-300">
          {companyData.optimized.map((truck) => (
            <TruckCard key={truck.truck_id} truck={truck} />
          ))}

          {companyData.unassignedLoads.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-red-600 font-medium">
              <span>⚠️</span>
              <span>Unassigned Loads: {companyData.unassignedLoads.join(", ")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
