require("dotenv").config();
import { app } from "./app";
import { connectDB } from "./db";
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`PORT connected Successfully : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error", err);
  });
