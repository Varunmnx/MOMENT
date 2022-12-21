import { PrismaClient } from "@prisma/client";
import { Errorhandler } from "../utils/errorhandler.js";
const prisma = new PrismaClient();
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import { response } from "express";

export const addtoCart=asyncErrorhandler(async(req,res,next)=>{
    console.log("_____running____Addto___cart____")
    let {id} = req.user
    let { name , description , price , rating , url , public_id ,itemId } = req.body
    
    //check if a product with itmeId exist in the cart already
    let existingIteminCart = await prisma.shoppingCart.findFirst({
                                                                        where:{
                                                                            itemId
                                                                        }
                                                                    })
    console.log("___existingIteminCart______")
    console.log(existingIteminCart)
    
    // if there is a product with that  itemId in cart then update its values
    if(existingIteminCart){
                    // updating cart with itemId
                    let singleprice = existingIteminCart.price / existingIteminCart.quantity
                    let updatedCartItem =  await prisma.shoppingCart.update({
                                                                                    where:{
                                                                                        itemId:existingIteminCart.itemId
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
                                        cartId:id,
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
        let {id} = req.user
        let itemid = req.body.id
        let deletedItem = await prisma.shoppingCart.delete({
            where:{
                id :itemid,
                cartId :id,   // this is the user reference id used in one to many relationship
            },
            include:{
                user:true
            }
        })
        console.log("___one__item__Deleted___")
        console.log(deletedItem)

        res.status(200).json({
                                    item
                                })

})