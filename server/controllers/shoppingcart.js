import { PrismaClient } from "@prisma/client";
import { Errorhandler } from "../utils/errorhandler.js";
const prisma = new PrismaClient();
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import { response } from "express";

export const addtoCart=asyncErrorhandler(async(req,res,next)=>{
    console.log("_____running____Addto___cart____")
    let cartId = req.user.id
    let { name , description , price , rating , url , public_id ,itemId } = req.body
    
    //check if a product with itmeId exist in the cart already
    let existingIteminCart = await prisma.shoppingCart.findFirst({
                                                                        where:{
                                                                            itemId,
                                                                            cartId
                                                                        }
                                                                    })
    console.log("___existingIteminCart______")
    console.log(existingIteminCart)
    
    // if there is a product with that  itemId in cart then update its values
    if(existingIteminCart){
                    // updating cart with itemId cannot update using 2 ids at the same time
                    let singleprice = existingIteminCart.price / existingIteminCart.quantity
                    let updatedCartItem =  await prisma.shoppingCart.update({
                                                                                    where:{
                                                                                        id:existingIteminCart.id
                                                                                    },
                                                                                    data:{
                                                                                        quantity:existingIteminCart.quantity + 1 ,
                                                                                        price:singleprice *( existingIteminCart.quantity + 1 )
                                                                                    }
                                                                                })
                    console.log("___existingcartitem____updated___")
                    console.log(updatedCartItem)

                    res.status(200).json({
                        status:"success",
                        updatedCartItem,
                        existing:"true"
                    })
    
                }
    // if there is no product with that particular  itemId in db then just create a new product in cart
    else{
                        let currentItem = await prisma.shoppingCart.create({
                                    data:{
                                        cartId,
                                        itemId,
                                        quantity:1,
                                        name ,
                                        description,
                                        price,
                                        rating,
                                        image:{
                                            url,
                                            public_id
                                        }
                                    },
                                    include:{
                                        user:true
                                    }
                                })  
                                
                        console.log("###################################")
                        console.log("______created____new_____item____")
                        console.log("###################################")
                        console.log("________current___Item_______")
                        console.log(currentItem)
                        res.status(200).json({
                            success:"true",
                            item:currentItem
                          })        
                        }

// next(new Errorhandler("couldn't add item to cart something went wrong",404))  

})


export const deletecartItem =asyncErrorhandler(async(req,res,next)=>{
        let cartId = req.user.id
        let itemId = req.body.itemId
// 
        let currentItem = await prisma.shoppingCart.findFirst({
                   where:{
                     OR:[
                        {
                            cartId,
                            itemId
                        }
                     ]
                   }
        })

         // performing deletion using id of that shoping cart
    await prisma.shoppingCart.delete({
        where:{
            id: currentItem.id
        }
       })

       let fullcart = await prisma.shoppingCart.findMany({
        where:{
            cartId
        },
       })
       console.log("_____full____cart______")
       console.log(fullcart)

})