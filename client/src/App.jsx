import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import Header from "./components/Header";

function App() {
  const [fleetData, setFleetData] = useState(null); // ✅ State for optimized data

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <Routes>
          {/* Upload Page → / */}
          <Route
            path="/"
            element={<UploadPage onUploadSuccess={(data) => setFleetData(data)} />}
          />

          {/* Dashboard Page → /dashboard */}
          <Route
            path="/dashboard"
            element={<DashboardPage data={fleetData} />} // ✅ Pass as prop
          />

          {/* Catch-all → Redirect to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
