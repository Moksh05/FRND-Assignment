const xlsx = require("xlsx");
const logger = require("../utils/logger");
const {getOptimizedResult} = require('../utils/optimizer')
let fleetData = [];

exports.uploadExcel = (req, res) => {
  try {
    logger.info("Received request to upload Excel file");
    if (!req.file) {
      logger.warn("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    fleetData = data.map((row) => ({
      truck_id: row["truck_id"],
      capacity: Number(row["capacity"]),
      assigned_load: Number(row["assigned_load"]),
      company: row["company"],
    }));

    logger.info(`Excel file processed successfully. Rows: ${fleetData.length}`);
    res.json({ trucks: fleetData });
  } catch (err) {
    logger.error("Failed to process Excel file", err);
    res.status(500).json({ error: "Failed to process Excel file" });
  }
};

exports.getFleetData = () => fleetData;

function convertOptimizedToCSV(data) {
  const rows = [];

  for (const company in data) {
    const companyData = data[company];
    companyData.optimized.forEach(truck => {
      rows.push({
        company,
        truck_id: truck.truck_id,
        capacity: truck.capacity,
        assigned_load: truck.assigned_load,
        assigned: truck.assigned.join(";"),
        remaining: truck.remaining,
        utilization: truck.fullyUtilized
          ? "100%"
          : ((truck.assigned.reduce((a, b) => a + b, 0) / truck.capacity) * 100).toFixed(2) + "%",
        cost: companyData.cost || 0,
      });
    });
  }

  if (!rows.length) return "";

  const header = Object.keys(rows[0]).join(",") + "\n";
  const csvBody = rows.map(r => Object.values(r).join(",")).join("\n");

  return header + csvBody;
}

exports.downloadReport = (req, res) => {
  try {
    const data = getOptimizedResult();

    if (!data) {
      return res.status(400).json({ error: "No optimized data available" });
    }

    const { format } = req.query;

    if (format === "csv") {
      const csv = convertOptimizedToCSV(data);
      res.header("Content-Type", "text/csv");
      res.attachment("optimized_report.csv");
      return res.send(csv);
    }

    // Default: JSON
    res.json(data);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
