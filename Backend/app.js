import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser()); //access  req.cookie

import auth from "./routes/auth.js";
import notes from "./routes/notes.js";

app.get("/api/test", (req, res) => {
  res.send("Backend is live and working!");
});
app.use("/auth", auth);
app.use("/notes", notes);
export { app };
