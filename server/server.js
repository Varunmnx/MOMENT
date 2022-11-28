import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./Routes/routes.js";
import mongoose from "mongoose";


const PORT = process.env.PORT_NUMBER || 3000;
const app = express();

//DB connection using mongoose
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log("MONGO DB connection Success");
      console.log("Server running at " + PORT + " ");
    })
  )
  .catch((err) => console.error(err));


app.use("/moments", router);

console.log("this is hi from Varun Narayanan");
