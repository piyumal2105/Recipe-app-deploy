import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import dbConnect from "./configs/dbConfig.js";
import AuthRoutes from "./routes/auth.routes.js";
import ReceipeRoute from "./routes/recipes.routes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const ___dirname = path.dirname(__filename);
console.log(___dirname);

const app = express();
app.use(express.json());
app.use(cookieParser());

const URL = process.env.ORIGIN_URL;

app.use(
  cors({
    credentials: true,
    origin: [URL, "https://recipe-app-deploy-1.onrender.com"],
  })
);

const PORT = process.env.PORT || 6001;

app.use("/api/auth", AuthRoutes);
app.use("/receipe", ReceipeRoute);

app.use(express.static(path.join(___dirname, "/client/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(___dirname, "/client/dist/index.html"))
);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Intrernal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.use((req, res, next) => {
  console.log(`${req.method} =====> URL: ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`🚀💀 Server is started on port ${PORT}!`);
  dbConnect();
});
