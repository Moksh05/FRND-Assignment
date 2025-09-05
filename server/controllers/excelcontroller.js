const xlsx = require("xlsx");
const logger = require("../utils/logger.js");
const Truck = require("../models/truckSchema.js");
const Company = require("../models/companySchema.js");
const Optimized = require("../models/optimizedSchema.js");
const { convertOptimizedToCSV } = require("../utils/convertTocsv.js");

// 📥 Upload & Parse Excel
const uploadExcel = async (req, res) => {
  try {
    logger.info("Received request to upload Excel file");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Optional: clear old data
    await Truck.deleteMany({});
    await Company.deleteMany({});
    await Optimized.deleteMany({});
    logger.info("Cleared old trucks and companies");

    // Parse Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    // Iterate through rows
    for (const row of data) {
      const companyName = row["company"];
      if (!companyName) continue;

      // Ensure company exists
      let company = await Company.findOne({ name: companyName });
      if (!company) {
        company = new Company({ name: companyName });
        await company.save();
      }

      // Create truck
      const truck = new Truck({
        truckId: row["truck_id"],
        capacity: Number(row["capacity"]),
        assignedLoad: Number(row["assigned_load"]) || 0,
        company: company._id,
      });

      await truck.save();
    }

    logger.info(`Excel file processed and saved. Rows: ${data.length}`);
    res.json({
      message: "Excel uploaded and saved successfully",
      totalRows: data.length,
    });

  } catch (err) {
    logger.error("Failed to process Excel file", err);
    res.status(500).json({ error: "Failed to process Excel file" });
  }
};

const downloadReport = async (req, res) => {
  try {
    // Get latest optimization run
    const optimization = await Optimized.findOne()
      .sort({ createdAt: -1 })
      .populate("companies.company")
      .populate("companies.optimized.truck")
      .lean();

    if (!optimization) {
      return res.status(400).json({ error: "No optimized data available" });
    }

    const { format } = req.query;

    if (format === "csv") {
      const csv = convertOptimizedToCSV(optimization);
      res.header("Content-Type", "text/csv");
      res.attachment("optimized_report.csv");
      return res.send(csv);
    }

    // Default: return full JSON
    res.json(optimization);
  } catch (err) {
    logger.error("Failed to generate report", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};

module.exports = {
  uploadExcel,
  downloadReport,
};
