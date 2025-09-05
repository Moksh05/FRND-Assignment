import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadCSV, getOptimizedLoads } from "../api/index";
import { FileText, UploadCloud } from "lucide-react";
import bgImage from "../assets/img2.jpg"; // <-- add background image

const UploadPage = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [totalCost, setTotalCost] = useState("");
  const navigate = useNavigate();

 const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];

  if (!selectedFile) return;

  // Check file extension
  const allowedExtensions = ["xlsx", "csv"];
  const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    setMessage("Invalid file type! Please upload a CSV or XLSX file.");
    setFile(null);
    return;
  }

  setFile(selectedFile);
  setMessage("");
};

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV/XLSX file first!");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await uploadCSV(file);
      setUploaded(true);
      setMessage("CSV uploaded successfully! Enter total cost and click 'Optimize'.");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!totalCost) {
      setMessage("Please enter total cost!");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const optimizedData = await getOptimizedLoads(totalCost);

      onUploadSuccess(optimizedData); // save in parent state
      navigate("/dashboard"); // redirect
    } catch (err) {
      console.error(err);
      setMessage("Optimization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})`,
     marginTop: '-82px',
    }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative w-full max-w-lg text-center bg-white/90 p-10 rounded-2xl shadow-lg backdrop-blur">
        {/* Title */}
        <h1 className="text-4xl font-semibold text-purple-600 mb-2">Upload</h1>
        <h1 className="text-4xl font-semibold text-purple-600 mb-6">Your Shipment Data</h1>
        <p className="text-lg text-gray-700 mb-8">
          Upload your CSV/XLSX file to optimize truck usage and reduce logistics costs.
        </p>

        {/* Upload area */}
        {!uploaded && (
          <>
            <label className="block border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md bg-gray-100">
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="w-14 h-14 text-purple-500 mb-4" />
                {!file ? (
                  <>
                    <span className="text-lg text-gray-500">Drop your CSV/XLSX file here</span>
                    <span className="text-gray-400 text-sm mt-1">or click to browse</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg text-gray-700 font-medium">{file.name}</span>
                    <span className="text-gray-400 text-sm mt-1">Ready to upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".csv, .xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </label>

            {file && (
              <button
                onClick={handleUpload}
                className="mt-5 w-full bg-purple-500 text-white text-lg px-6 py-3 rounded-xl shadow-sm hover:bg-purple-600 transition-colors font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload File"}
              </button>
            )}
          </>
        )}

        {/* After upload */}
        {uploaded && (
          <div className="mt-6 border border-gray-300 p-6 rounded-xl bg-gray-50 shadow-sm flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-7 h-7 text-purple-500" />
              <span className="text-lg text-gray-700 font-medium">{file?.name}</span>
            </div>

            <input
              type="number"
              placeholder="Enter total cost"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              className="w-full p-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
            />

            <button
              onClick={handleOptimize}
              className="w-full bg-green-500 text-white text-lg px-6 py-3 rounded-xl shadow-sm hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Optimizing..." : "Optimize"}
            </button>
          </div>
        )}

        {message && (
          <p className="mt-5 text-purple-600 text-base font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
