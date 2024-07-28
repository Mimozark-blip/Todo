import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./auth.js";
import listRouter from "./Crud/list.js";
const port = 3000;
const conString =
  "mongodb+srv://namiafahil70:YCgrJ0fSFLuMrN1I@todo.rmniwcm.mongodb.net/todo?retryWrites=true&w=majority&appName=todo";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB!");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Routes
app.use("/api/v1", authRouter); // Authentication routes
app.use("/api/v2", listRouter); // CRUD routes

// Connect to MongoDB
connectDB(conString);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
