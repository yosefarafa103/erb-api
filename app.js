import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { dbConnection } from "./db.config.js";
import usersRoutes from "./modules/users/users.routes.js";
import tenentsRoutes from "./modules/tenents/tenents.routes.js";
import cookieParser from "cookie-parser";
import moragn from "morgan";
const PORT = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(moragn("common"));

app.use("/users", usersRoutes);
app.use("/tenents", tenentsRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

dbConnection()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection");
    process.exit(1);
  });
