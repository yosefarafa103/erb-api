import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { dbConnection } from "./db.config.js";
import usersRoutes from "./modules/users/users.routes.js";
import tenentsRoutes from "./modules/tenents/tenents.routes.js";
import salesRoutes from "./modules/sales/sales.routes.js";
import customersRoutes from "./modules/customers/customer.routes.js";
import productsRoutes from "./modules/products/products.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import journalEntries from "./modules/journalEntries/Journal.routes.js";
import cookieParser from "cookie-parser";
import moragn from "morgan";
const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: ["https://erb-system-gold.vercel.app/", "http://localhost:3000/"],
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.send("OK");
});
/* Middlwares */
app.use(express.json());
app.use(cookieParser());
app.use(moragn("common"));
/* Middlwares */

/* Routes */
app.use("/users", usersRoutes);
app.use("/tenents", tenentsRoutes);
app.use("/sales", salesRoutes);
app.use("/customers", customersRoutes);
app.use("/products", productsRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/journal-entries", journalEntries);
/* Routes */

/* Error Handel Middlware */
app.use((err, req, res, next) => {
  console.log("ERRRRRR: ", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
/* Error Handel Middlware */

/* DB Connection */
dbConnection()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection");
    process.exit(1);
  });
/* DB Connection */

export default app;
