const express = require("express");
const connectDB = require("./config/db"); 
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: [
    "http://localhost:5000",   // Local dev server
    "http://localhost:5173",   // Vite dev server
    "https://school-payment-system-production.up.railway.app" // Railway deployment
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));




app.use("/api/auth", authRoutes);
app.use("/api", paymentRoutes);
app.use("/transactions", transactionRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});
 
app.get("/payment-successful", (req, res) => {
  res.send("Payment Successfull..");
});

module.exports = app;
