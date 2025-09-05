// src/components/TruckCard.jsx
import React from "react";
import { Truck, BarChart2, Layers } from "lucide-react";

const TruckCard = ({ truck }) => {
  const truckLoad = truck.assigned.reduce((sum, l) => sum + l, 0);
  const utilization =
    truck.capacity > 0 ? ((truckLoad / truck.capacity) * 100).toFixed(2) : 0;

  // Determine color based on utilization
  const utilizationColor = utilization >= 80 ? "bg-green-500" : "bg-red-500";

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Truck Info */}
      <div className="flex items-center gap-3">
        <div className="bg-purple-100 rounded-full p-2">
          <Truck className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{truck.truck_id}</h3>
          <div className="text-sm text-gray-500 flex gap-3 mt-1">
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4 text-gray-400" />
              Capacity: {truck.capacity}
            </span>
            <span className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4 text-gray-400" />
              Load: {truckLoad}
            </span>
          </div>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="flex flex-col w-full sm:w-48">
        <span className="text-sm font-medium text-gray-700 mb-1">Utilization: {utilization}%</span>
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className={`${utilizationColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${utilization}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TruckCard;
