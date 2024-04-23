import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log('JWT_KEY:', process.env.JWT_KEY);
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
