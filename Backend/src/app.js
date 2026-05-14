import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.js";
import jobsRouter from "./routes/jobs.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const defaultOrigins = "http://localhost:3000,https://gnta-sigma.vercel.app";
const allowedOrigins = (process.env.FRONTEND_URL || defaultOrigins)
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.use(notFound);
app.use(errorHandler);

function normalizeOrigin(origin) {
  return origin.trim().replace(/\/+$/, "");
}

export default app;
