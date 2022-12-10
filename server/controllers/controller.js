import { PrismaClient } from "@prisma/client";
import { Errorhandler } from "../utils/errorhandler.js";
const prisma = new PrismaClient();
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import { Apifeatures } from "../utils/apifeatures.js";

export const findAllProduct = asyncErrorhandler(async (req, res, next) => {
  console.log("___finding_all_products____")
  //to find the requesting url
  try{
  req.headers.origin && console.log(req.headers.origin);
  // console.log(req.headers.referer)
  // console.log(req.params)
  console.log(req.query)
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
    });
    res.status(201).json(product);
  } catch (err) {
    next(new Errorhandler("product not found",404))
  }
})


export const updateproduct =asyncErrorhandler( async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    rating,
    images,
    stock,
    numberofreviews,
    category,
  } = req.body;

  try {
    let product = await prisma.products.findUnique({
      where: {
        id,
      },
    });
    if (product.length == 0) {
      next(new Errorhandler("no such product ",201))
    } else {
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
          numberofreviews,
          category,
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
    numberofreviews,
    category,
  } = req.body;


    let newproduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        rating,
        images,
        stock,
        numberofreviews,
        category,
      },
    });
    if (newproduct) {
      res.status(200).json(newproduct);
    }

}
)
