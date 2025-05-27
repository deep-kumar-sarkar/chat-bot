import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: "API KEY",
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.post("/gemini", async (req, res) => {
  try {
    console.log("Received request:", req.body);
    const prompt = req.body.prompt;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    console.log("AI Response received");
    res.json({ response: response.text });
  } catch (error) {
    console.error("Error in /gemini endpoint:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Serve static files
app.use(express.static("."));

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Open http://localhost:3000 in your browser to use the chatbot");
});

// Handle server shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server shut down successfully");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => {
    console.log("Server shut down due to uncaught exception");
    process.exit(1);
  });
});
