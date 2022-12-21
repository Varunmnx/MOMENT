import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./Routes/routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from '@prisma/client'

import { errorHandlerMiddleWare } from "./middlewares/errormiddleware.js";
const prisma = new PrismaClient()

const PORT = process.env.PORT_NUMBER || 3000;
const app = express();
app.use(cookieParser())
app.use(cors());
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))


app.use("/", router);
//next with error binded to error class with be consumed by this function
app.use(errorHandlerMiddleWare)



// async function createComment(){
 
//  let oneuser = await prisma.user.findFirst({
//     where:{
//         id :"63943ed4c6564b65951db059"
//     },
//  })
 
//  let allusers = await prisma.user.findFirst({
//     where:{
//         id:oneuser.id
//     },
//     include:{
//         shoppingCart:true
//     }
//  })


//  console.log(allusers)
// }

// createComment()


app.listen(PORT,()=>console.log(`SERVER RUNNING ON ${PORT} `))
//edge case
process.on("unhandledRejection",(err)=>{
    console.log(err.message)
    console.log("shutting down the system")
    app.close(()=>process.exit(1))
})


