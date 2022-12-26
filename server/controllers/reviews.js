import { PrismaClient } from "@prisma/client";
import { Errorhandler } from "../utils/errorhandler.js";
const prisma = new PrismaClient();
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";


export const addReview = asyncErrorhandler(async(req,res,next)=>{

  console.log("____adding____reviews_____")

   let { comment , name , rating , productId } = req.body
   let authorId = req.user.id 
   let existingReview =await prisma.reviews.findFirst({
                                                            where:{
                                                                authorId
                                                            }
                                                        })

   if(existingReview){
    console.log("_____existing___Review_____")
    console.log(existingReview)
    await prisma.reviews.create({
        data:{
            name,
            comment,
            rating,
            authorId,
            productId
        }
})

   }

  

   let allReviews = await fetchallReviews(productId)
   console.log(allReviews)
   let existingproduct = await prisma.products.findFirst({
                                        where:{
                                            id:productId
                                        }
                                    })
   if(!existingReview){
            let updatedRating = existingproduct.rating === 0 && !existingproduct ? 0 : ( ( existingproduct.rating + rating ) / ( allReviews.length + 1 ) )
            console.log("____rating______")
            console.log(updatedRating)
            updatedRating = Math.ceil(updatedRating)
            await prisma.reviews.create({
                data:{
                    name,
                    comment,
                    rating,
                    authorId,
                    productId
                }
              })
            let updatedReviews =await prisma.products.update({
                                                where:{
                                                        id: productId
                                                },
                                                data:{
                                                    rating : updatedRating
                                                },
                                                include:{
                                                    reviews:true
                                                }
                                            })
            console.log(updatedReviews)
            allReviews = await fetchallReviews(updatedReviews.id)    
             
            res.status(200).json({
                allReviews,
                state:"success"
            })
    }else if(existingReview){
       
        allReviews = await fetchallReviews(productId)

        res.status(200).json({
            allReviews,
            state:"success"
        })
    }else{
        next(new Errorhandler("something went wrong please take a look ",404))
    }
 
})

export const updateReview = asyncErrorhandler(async(req,res,next)=>{

})

export const deleteReview = asyncErrorhandler(async(req,res,next)=>{
    console.log("_____deleting a____ review________")
    let { id } = req.body

    await prisma.reviews.delete({
                                    where:{
                                        id
                                    }
                                })
    
    let allreviews = await fetchallReviews()


    res.status(200).json({
        allreviews,
        status:"success"
    })
    
})




export async function fetchallReviews(productId){
 
let allreview = await prisma.reviews.findMany({
                            where:{
                                productId
                            }
                        })
return allreview

} 