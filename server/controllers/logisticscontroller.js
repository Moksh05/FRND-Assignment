// controllers/logisticsController.js
const logger = require("../utils/logger.js");
const { optimizeLoads } = require("../utils/optimizer.js");
const Truck = require("../models/truckSchema.js");
const Company = require("../models/companySchema.js");
const Optimization = require("../models/optimizedSchema.js");

const getOptimizedLoads = async (req, res) => {
  try {
    const { totalCost } = req.query;
    if (!totalCost) {
      logger.warn("Total cost parameter is missing");
      return res
        .status(400)
        .json({ error: "Total cost parameter is required" });
    }

    const trucks = await Truck.find().lean();
    if (!trucks.length) {
      logger.warn("No trucks available in DB");
      return res
        .status(400)
        .json({ error: "No trucks available for optimization" });
    }

    // 🔹 Optimizer returns DB-ready structure
    const result = optimizeLoads(trucks, totalCost);

    // ✅ Save to DB
    const optimization = new Optimization(result);
    await optimization.save();

    // ✅ Update truck loads + company costs
    for (const company of result.companies) {
      for (const truck of company.optimized) {
        await Truck.findByIdAndUpdate(truck.truck, {
          assignedLoad: truck.assigned.reduce((a, b) => a + b, 0),
        });
      }

      await Company.findByIdAndUpdate(company.company, {
        cost: company.cost,
      });
    }

    // ✅ Populate only needed fields
    const populated = await Optimization.findById(optimization._id)
      .populate("companies.company", "name totalCostShare") // only keep these
      .populate("companies.optimized.truck", "truckId capacity assignedLoad company"); // only keep these

    logger.info("Load optimization completed successfully");
    res.status(200).json(populated);
  } catch (err) {
    logger.error("Failed to optimize loads", err);
    res.status(500).json({ error: "Optimization failed" });
  }
};

const getOptimizationResult = async (req, res) => {
  try {
    // fetch the latest optimization (or you can use query filters if needed)
    const optimization = await Optimization.findOne()
      .sort({ createdAt: -1 })
      .populate("companies.company", "name totalCostShare")
      .populate("companies.optimized.truck", "truckId capacity assignedLoad company");

    if (!optimization) {
      logger.warn("No optimization data found in DB");
      return res.status(404).json({ error: "No optimization data available" });
    }

    res.status(200).json(optimization);
  } catch (err) {
    logger.error("Failed to fetch optimization result", err);
    res.status(500).json({ error: "Failed to fetch optimization result" });
  }
};


module.exports = { getOptimizedLoads ,getOptimizationResult};
