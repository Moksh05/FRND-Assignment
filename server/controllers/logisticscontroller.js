const { getFleetData } = require("./excelcontroller");
const logger = require("../utils/logger");
const { optimizeLoads,setOptimizedResult } = require("../utils/optimizer");

exports.getOptimizedLoads = (req, res) => {
  try {
    const trucks = getFleetData(); // parsed from CSV upload
    if(!trucks.length) {
      logger.warn("No fleet data available for optimization");
      return res.status(400).json({ error: "No fleet data available" });
    }
    const {totalCost} = req.query; // or derive from DB/config
    console.log("Total Cost from query:", totalCost);
    if (!totalCost) {
      logger.warn("Total cost parameter is missing");
      return res.status(400).json({ error: "Total cost parameter is required" });
    }
    const result = optimizeLoads(trucks, totalCost);
    setOptimizedResult(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Optimization failed" });
  }
};
