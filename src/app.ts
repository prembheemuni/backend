import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

// Importing Routes
import userRouter from "./routes/user.route";
import { API_VERSION } from "./constants";

// Defining Routes
app.use(`${API_VERSION}/users`, userRouter);

export { app };
