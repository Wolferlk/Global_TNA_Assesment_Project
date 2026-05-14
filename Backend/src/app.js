import cors from "cors";
import express from "express";
import jobsRouter from "./routes/jobs.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/jobs", jobsRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
