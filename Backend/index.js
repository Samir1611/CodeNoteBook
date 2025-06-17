import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

// importing approach
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
      console.log(`Server running at Port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to MONGODB!!", error);
  });
