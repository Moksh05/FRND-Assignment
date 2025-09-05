import axios from "axios";

// Base URL of your backend
const API_BASE = "http://localhost:3000/api/v1"; // change if needed

// Upload CSV file
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${API_BASE}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};

// Fetch optimized load results
export const getOptimizedLoads = async (totalCost) => {
  try {
    const res = await axios.get(`${API_BASE}/optimizeload?totalCost=${totalCost}`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Fetching optimized loads failed:", err);
    throw err;
  }
};




export const downloadReport = async (format = "csv") => {
  try {
    const res = await axios.get(`${API_BASE}/report?format=${format}`, {
      responseType: "blob", // important for file downloads
    });

    // Determine file name and type
    const fileName = `optimized_report.${format}`;
    const blob = new Blob([res.data], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`${fileName} downloaded successfully.`);
  } catch (err) {
    console.error("Downloading report failed:", err);
    throw err;
  }
};

