import { PrismaClient } from "@prisma/client";
import { Errorhandler } from "../utils/errorhandler.js";
const prisma = new PrismaClient();
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import { fetchCart } from "./shoppingcart.js";

export const checkOut = asyncErrorhandler(async(req,res,next)=>{
   let {
         phoneNumber,
         country,
         state,
         pincode,
         areaDetails,}   =  req.body  // parsing shipping information
   
   let orderId = req.user.id
   
   let shoppingCart = await fetchCart(orderId)

   let neworder = await prisma.orderDetails.create({ data:{   
                                                phoneNumber,
                                                areaDetails,
                                                pincode,
                                                country,
                                                state,
                                                orderId

                                                     }  })
    let orderDetails = await prisma.orderDetails.findFirst({
                                                            where:{
                                                                  id: neworder.id
                                                            },
                                                            include:{
                                                               items:true
                                                            }
                                                      })
    
      console.log(orderDetails)

})


export const listOrders = asyncErrorhandler(async(req,res,next)=>{
   

})


export const orderDetails = asyncErrorhandler(async(req,res,next)=>{
   

})