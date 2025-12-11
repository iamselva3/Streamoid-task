import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userroutes.js";
import marketplaceRoutes from "./routes/marketrouts.js";
import sellerRoutes from "./routes/sellerroutes.js";
import mappingRoutes from "./routes/mapping.js";  
import authRoutes from "./routes/auth.js";
import { authenticate,permit } from "./middleware/auth.js";


dotenv.config();

const app = express();

// DB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err.message);
    process.exit(1);
  }
};

connectDB();

    // Middlewares
app.use(cors());
app.use(bodyParser.json());

// Simple test route
app.get("/", (req, res) => {
    console.log("Root route accessed");
});

app.use('/api/auth', authRoutes);

// const { authenticate, permit } = require('./middleware/auth.js');


app.use('/api/marketplaces', marketplaceRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/mappings', mappingRoutes);
// User routes
app.use("/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Backend is running 🔥");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
