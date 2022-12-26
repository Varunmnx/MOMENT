import { PrismaClient } from "@prisma/client";
import { Errorhandler } from "../utils/errorhandler.js";
const prisma = new PrismaClient();
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";




// adding to cart and incrementing quantity
export const addtoCart=asyncErrorhandler(async(req,res,next)=>{
    // console.log("_____running____Addto___cart____")
    let cartId = req.user.id
    let { itemId } = req.body
    let product = await fetchProduct(itemId)
    if(!product)next(new Errorhandler("This item is not sold by any one kindly contact us",404)) 

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
                     await prisma.shoppingCart.update({
                                                                                    where:{
                                                                                        id:existingIteminCart.id
                                                                                    },
                                                                                    data:{
                                                                                        quantity:existingIteminCart.quantity + 1 ,
                                                                                        price:singleprice *( existingIteminCart.quantity + 1 )
                                                                                    }
                                                                                })
                    // console.log("___existingcartitem____updated___")
                    // console.log(updatedCartItem)
                    let cartStatus = await fetchCart(cartId)
                    console.log("____________________current___cart_____________")
                    console.log(cartStatus)
                    res.status(200).json({
                        status:"success",
                        cart :cartStatus ,
                        existing:"true"
                    })
    
                }
    // if there is no product with that particular  itemId in db then just create a new product in cart
    else{
                        let currentItem = await prisma.shoppingCart.create({
                                    data:{
                                        cartId , // user id
                                        itemId,
                                        quantity:1,
                                        name:product.name ,
                                        description:product.description,
                                        price:product.price,
                                        rating:product.rating,
                                        image:{
                                            url:product.images.url,
                                            public_id:product.images.public_id
                                        }
                                    },
                                    include:{
                                        user:true
                                    }
                                })  
                                
                        // console.log("###################################")
                        // console.log("______created____new_____item____")
                        // console.log("###################################")
                        // console.log("________current___Item_______")
                        // console.log(currentItem)
                        res.status(200).json({
                            success:"true",
                            item:currentItem
                          })        
                        }

// next(new Errorhandler("couldn't add item to cart something went wrong",404))  

})

// removing the cart item 
export const deletecartItem =asyncErrorhandler(async(req,res,next)=>{
        let cartId = req.user.id
        let itemId = req.body.itemId

        console.log("____________Deleting________________")
        let currentItem = await prisma.shoppingCart.findFirst({
                   where:{
                            cartId,
                            itemId
                    
                   }
        })
   
    if(!currentItem)next(new Errorhandler("Item donot exist",404))    
         // performing deletion using id of that shoping cart
    await prisma.shoppingCart.delete({
        where:{
            id: currentItem.id
        }
       })
     let currentCart = await fetchCart(cartId)  
     res.status(200).json({
        cart:currentCart
     })

})


export const decreaseQuantity =asyncErrorhandler(async(req,res,next)=>{
    let cartId = req.user.id 
    let {itemId} = req.body
    // finding cart with item to extract id of the unique cart
    // console.log(cartId)
    // console.log(itemId)
    let cartItem = await prisma.shoppingCart.findFirst({
                                                            where:{
                                                    
                                                                    cartId,
                                                                    itemId
                                                                }
                        
                                                    })


    // console.log("######cart___Item______________________")
    // console.log(cartItem)
    if(cartItem.quantity >1){
       console.log("item is present in the cart ")
       const unitPrice = cartItem.price / cartItem.quantity  // calculating per unit price of item
       await prisma.shoppingCart.update({
                                                            where:{
                                                                id:cartItem.id
                                                            },
                                                            data:{
                                                                quantity: cartItem.quantity - 1 ,
                                                                price: cartItem.price - unitPrice
                                                            }
                                                            
                                                        })
        let cartStatus = await fetchCart(cartId)
        res.status(200).json({
            state:"success",
            updatedCart : cartStatus
        })
    }      else if(cartItem?.quantity ===1){    
                        const unitPrice = cartItem.price / cartItem.quantity  // calculating per unit price of item
                        await prisma.shoppingCart.delete({
                                                                            where:{
                                                                                id:cartItem.id
                                                                            }
                                                                            
                                                                        })
                        let cartStatus = await fetchCart(cartId)
                        res.status(200).json({
                            state:"success",
                            updatedCart :cartStatus
                        })

    }   else{
        next(new Errorhandler("something went wrong",404))
    }                                                
})



export const clearCart = asyncErrorhandler(async(req,res,next)=>{
    let cartId = req.user.id 
    // deleting all the items in the cart associated with one user 
    let emptyCart = await prisma.shoppingCart.deleteMany({
                                                            where:{
                                                                        cartId
                                                            }
                                                        })
    console.log("________card_____emptied___________")
    console.log(emptyCart)

    let cartStatus = await fetchCart(cartId)               

    if(emptyCart){
        
        res.status(200).json({
            state:"success",
            cart : cartStatus
        })

    } else{
      
        next(new Errorhandler("something went wrong check your cart is empty",404))
    
    }

})


// fetching updated cart
export async function fetchCart(cartId){
 
  let currentCartState = await prisma.shoppingCart.findMany({
    where:{
        cartId
    }
  })
  return currentCartState
}

// fetching product details

export async function fetchProduct(id){

    let product = await prisma.products.findFirst({
                                                    where:{
                                                        id
                                                    }
                                                })

// returning product details                                               
 return product
    }