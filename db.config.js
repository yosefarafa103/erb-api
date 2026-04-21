import mongoose from "mongoose";

async function dbConnection() {
  return await mongoose
    .connect(process.env.DB_CONNNECTION_STR)
    .then(() => console.log("mongoose is connected"))
    .catch((err) => console.log("failed to connect to mongoose: ", err));
}

export { dbConnection };
