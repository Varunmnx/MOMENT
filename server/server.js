import dotenv from "dotenv";
dotenv.config();
import express from "express";
import routerall from "./Routes/routes.js";
import cartRoutes from "./Routes/cartRoutes.js"  // cart functionalities
import profileRoutes  from "./Routes/profileRoutes.js" // personal details editing 
import shipmentRoutes from "./Routes/shipmentRoute.js" // shipment details adding and checkout handling
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


app.use("/", routerall);
app.use("/cart",cartRoutes)
app.use("/me",profileRoutes)
app.use("/checkout",shipmentRoutes)
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

// let user =await prisma.products.findFirst({
//     where:{
//         id:"63a9888310106fa85b6dbc1f"
//     },
//     include:{
//         cart:true
//     }
// })
// console.log("______user___with___current____Cart__________")
// console.log(user)

app.listen(PORT,()=>console.log(`SERVER RUNNING ON ${PORT} `))
//edge case
process.on("unhandledRejection",(err)=>{
    console.log(err.message)
    console.log("shutting down the system")
    app.close(()=>process.exit(1))
})


