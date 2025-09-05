// models/optimizationSchema.js
const mongoose = require("mongoose");

const optimizationSchema = new mongoose.Schema({
  totalCost: { type: Number, required: true },
  companies: [
    {
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      cost: Number,
      originalTruckCount: Number,
      trucksUsed: Number,
      stats: {
        assigned: Number,
        capacity: Number,
        utilization: String, // e.g., "75%"
      },
      unassignedLoads: [Number],
      optimized: [
        {
          truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
          assigned: [Number], // loads assigned to this truck
          remaining: Number,
          fullyUtilized: Boolean,
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
optimizationSchema.index({ company: 1, createdAt: -1 });
module.exports = mongoose.model("Optimization", optimizationSchema);
