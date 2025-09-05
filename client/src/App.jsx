import React, { useState } from "react";
import DashboardPage from "./pages/Dashboard";
import UploadPage from "./pages/uploadPage";
import { Truck } from "lucide-react";

import Header from "./components/Header";
function App() {
  const [fleetData, setFleetData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {fleetData ? (
        <DashboardPage data={fleetData} />
      ) : (
        <UploadPage onUploadSuccess={setFleetData} />
      )}
    </div>
  );
}

export default App;
