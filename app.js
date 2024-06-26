import path from 'node:path';
import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.js";
import "./db.js";

const app = express();

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use(morgan("tiny"));
app.use(cors());

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).send({ message: "Route Not Found"});
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

app.listen(8080, () => {
  console.log("Server is running. Use our API on port: 8080");
});
