const app = require('./app');
const mongoose = require("mongoose");
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
connectDB();
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});