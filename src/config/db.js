const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB CONNECTED SUCCESSFULLY");
  } catch (err) {
    console.error("❌ MongoDB CONNECTION FAILED", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
