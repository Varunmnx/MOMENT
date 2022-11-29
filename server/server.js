import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./Routes/routes.js";
import bodyParser from "body-parser";
import cors from "cors";


const PORT = process.env.PORT_NUMBER || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))


app.use("/", router);
console.log("this is hi from Varun Narayanan");

app.listen(PORT,()=>console.log(`SERVER RUNNING ON ${PORT} `))