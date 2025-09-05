import React from "react";
import CompanyCard from "../components/CompanyCard";
import { downloadReport } from "../api";
import { Truck, Globe, Activity, BarChart2 } from "lucide-react";
import headerImage from "../assets/img1.jpg"; // <-- import your image here

const quotes = [
  "Efficiency is doing better what is already being done.",
  "Every mile counts in saving resources.",
  "Optimized routes, optimized business.",
  "Green fleet, bright future.",
  "Data-driven decisions lead the way."
];

const DashboardPage = ({ data }) => {
  const handleDownload = async (format = "csv") => {
    try {
      await downloadReport(format);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header with background image */}
      <div
        className="relative bg-cover bg-center "
        style={{ backgroundImage: `url(${headerImage})` }}
      >
        <div className="bg-black bg-opacity-40 p-8 min-h-[200px] md:min-h-[300px]" >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-3 flex items-center justify-center animate-pulse">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-wide drop-shadow-md">
                  Fleet Dashboard
                </h1>
                <p className="text-gray-200 mt-1 italic drop-shadow">
                  "{quotes[Math.floor(Math.random() * quotes.length)]}"
                </p>
              </div>
            </div>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDownload("csv")}
                className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-xl shadow hover:scale-105 hover:shadow-lg transition-transform duration-300 flex items-center gap-2"
              >
                <BarChart2 className="w-5 h-5" /> Download CSV
              </button>
              <button
                onClick={() => handleDownload("json")}
                className="bg-gradient-to-r from-purple-400 to-purple-300 text-white px-6 py-3 rounded-xl shadow hover:scale-105 hover:shadow-lg transition-transform duration-300 flex items-center gap-2"
              >
                <Activity className="w-5 h-5" /> Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Cards */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.keys(data).map((company, index) => (
            <CompanyCard
              key={company}
              companyName={company}
              companyData={data[company]}
              className="transition-transform hover:scale-105 hover:shadow-xl"
            >
              <div className="mt-3 flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4 text-green-500" />
                <span>
                  {data[company].assignedTrucks < data[company].totalTrucks
                    ? "Resources available"
                    : "Fully utilized"}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                "{quotes[index % quotes.length]}"
              </p>
            </CompanyCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
