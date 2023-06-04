import dotenv from "dotenv";
dotenv.config();
import express from "express";
import commentRoutes from "./Routes/commentRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js"  // cart functionalities
import profileRoutes  from "./Routes/profileRoutes.js" // personal details editing 
import shipmentRoutes from "./Routes/shipmentRoute.js" // shipment details adding and checkout handling
import productRoutes from "./Routes/productsRoutes.js"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from '@prisma/client'
import cloudinary from "cloudinary"
import { errorHandlerMiddleWare } from "./middlewares/errormiddleware.js";
const prisma = new PrismaClient()
import fileUpload from "express-fileupload"
import {setUpGoogleAndFacebookPassportAuthSetup} from "./utils/passPort.config.js"


setUpGoogleAndFacebookPassportAuthSetup()

cloudinary.config({  
    cloud_name:process.env.CLOUD_NAME,  
    api_key: process.env.CLOUDE_API_KEY,  
    api_secret:process.env.CLOUD_API_SECRET 
}); 



const PORT = process.env.PORT_NUMBER || 3000;
const app = express();
app.use(cookieParser())
app.use(cors({
    origin:"*"
}));
app.use(fileUpload({   
    useTempFiles: true,
    tempFileDir: "/tmp/",}))

app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))


app.use("/api/cart",cartRoutes)
app.use("/api/user",profileRoutes)
app.use("/api/checkout",shipmentRoutes)
app.use("/api/product",productRoutes)
app.use("/api/comment",commentRoutes)

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


