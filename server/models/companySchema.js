const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    totalCostShare: { type: Number, default: 0 }, // updated after reconciliation
  },
  { timestamps: true }
);
companySchema.index({ name: 1 });  

module.exports = mongoose.model("Company", companySchema);
