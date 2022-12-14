import { PrismaClient } from "@prisma/client";
import { Errorhandler } from "../utils/errorhandler.js";
const prisma = new PrismaClient();
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import { Apifeatures } from "../utils/apifeatures.js";

export const findAllProduct = asyncErrorhandler(async (req, res, next) => {

  try{
  req.headers.origin && console.log(req.headers.origin);
  let  products =  await new Apifeatures(await prisma.products,req.query).filter()
  
  let fetchedproducts = (await products).query

  res.status(200).json(fetchedproducts);
  }catch(err){
    next(err)
  } 
})

export const productDetails = asyncErrorhandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await prisma.products.findMany({
      where: {
        id: id,
      },
      include:{
        reviews:true
      }
    });
    res.status(201).json(product);
  } catch (err) {
    next(new Errorhandler("product not found",404))
  }
})


export const updateproduct =asyncErrorhandler( async (req, res, next) => {
  console.log("_____updating_________")
  const { id } = req.params;
  const {
    name,
    description,
    price,
    rating,
    images,
    stock,

    category,
  } = req.body;

  try {
    let product = await prisma.products.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      next(new Errorhandler("no such product ",201))
    } else {
      console.log("_________updating___product________")
      let updatedproduct = await prisma.products.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          price,
          rating,
          images,
          stock,
          category,
          user : {
            type: req.user.id,
          }
          
        },
      });

      res.status(201).json({
        isaproduct: true,
        updatedproduct,
      });
    }
  } catch (err) {
    next(new Errorhandler("product cannot be updated",404))
  }
});

export const createnewProduct = asyncErrorhandler(async (req, res, next) => {
  const {
    name,
    description,
    price,
    rating,
    images,
    stock,
    category,
  } = req.body;
  
  // check if same product exists
  let existingproduct = await prisma.products.findFirst({ where:{
                                                                   OR:
                                                                       [
                                                                        {
                                                                          name:name,
                                                                          price:price,
                                                                          description:description,
                                                                          category:category
                                                                        }
                                                                       ]
                                                                  
  }})
  if(existingproduct)next(new Errorhandler("this product exists already add a new one or contact us",404))


    let newproduct = await prisma.products.create({
                                                      data: {
                                                              name,
                                                              description,
                                                              price,
                                                              rating,
                                                              images,
                                                              stock,
                                                              category,
                                                              user : {
                                                                type: req.user.id,
                                                              }
                                                            }, });
    if (newproduct) {
      res.status(200).json(newproduct);
    }  } )


export const deleteProduct=asyncErrorhandler(async(req,res,next)=>{
  let {id} = req.params
  
  if(!id)next(new Errorhandler("Please provide an ID",201))

  let product = await prisma.products.delete({ where:{  id:id }  })
  res.send({
             status:"success",
             product:product 
            
            })
  next()
})


