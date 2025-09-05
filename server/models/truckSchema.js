const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema(
  {
    truckId: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    assignedLoad: { type: Number, default: 0 },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

truckSchema.index({ truckId: 1 });          
truckSchema.index({ company: 1 });         
truckSchema.index({ assignedLoad: 1 }); 

module.exports = mongoose.model("Truck", truckSchema);
