import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./Routes/routes.js";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from '@prisma/client'
import { errorHandlerMiddleWare } from "./middlewares/errormiddleware.js";
const prisma = new PrismaClient()

const PORT = process.env.PORT_NUMBER || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))

app.use("/", router);
app.use(errorHandlerMiddleWare)
console.log("this is hi from Varun Narayanan");

app.listen(PORT,()=>console.log(`SERVER RUNNING ON ${PORT} `))



//edge case
process.on("unhandledRejection",(err)=>{
    console.log(err.message)
    console.log("shutting down the system")
    app.close(()=>process.exit(1))
})


