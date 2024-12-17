import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.use("/", routes);

app.listen(4400, () => console.log("Server running on port 4400"));
