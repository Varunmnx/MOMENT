import { PrismaClient } from "@prisma/client";
import { Errorhandler } from "../utils/errorhandler.js";
const prisma = new PrismaClient();
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import { fetchCart } from "./shoppingcart.js";

export const checkOut = asyncErrorhandler(async (req, res, next) => {
  let { phoneNumber, country, state, pincode, areaDetails, paymentMode } =
    req.body; // parsing shipping information

  let orderId = req.user.id;

  let shoppingCart = await fetchCart(orderId);
  let orderItems = [];
  let total = 0;
  shoppingCart.forEach((item) => {
    let tobepushed = {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      itemId: item.itemId,
    };
    console.log(item.price)
    total += item.price;
    orderItems.push(tobepushed);
  });


  let neworder = await prisma.orderDetails.create({
    data: {
      phoneNumber,
      areaDetails,
      pincode,
      country,
      state,
      orderId,
      orderItems,
      total,
      paymentMode,
    },
  });
  let orderDetails = await prisma.orderDetails.findMany({
    where: {
      id: neworder.id,
    },
  });
  console.log("_________order___Details_________");
  console.log(orderDetails);
  res.status(200).json({
    shipmentDetails: orderDetails,
  });
});

export const listOrders = asyncErrorhandler(async (req, res, next) => {
  let orderId = req.user.id; // id of cart of each user
  let allUserOrders = await prisma.orderDetails.findMany({
    where: {
      orderId,
    },
  });
  if (!allUserOrders) next(new Errorhandler("make a shipment", 404));
  res.status(200).json({
    allorders: allUserOrders,
  });
});

export const orderDetails = asyncErrorhandler(async (req, res, next) => {
  let { id } = req.params;
  console.log(id);

  let singleOrder = await prisma.orderDetails.findFirst({
    where: {
      id,
    },
  });
  if (!singleOrder) {
                
                  next(new Errorhandler("no such order exists", 404));
  } else {
                  res.status(200).json({
                        order: singleOrder,
                        description: "detailed order",
                  });
  }
});

// delete order from cms
export const removeOrder = asyncErrorhandler(async (req, res, next) => {
  const { id } = req.body;
  let deletedOrder = await prisma.orderDetails.delete({
    where: {
      id,
    },
  });
  if (!deletedOrder) next(new Errorhandler("couldn't delete item", 404));
  res.status(200).json({
    status: "success",
    deletedOrder,
  });
});

export const updateStatus = asyncErrorhandler(async (req, res, next) => {
  let { id } = req.params;
  let { status } = req.body;

  let updatedOrder = await prisma.orderDetails.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  console.log(updatedOrder);
  if (!updatedOrder) next(new Errorhandler("no such order exists", 404));

  res.status(200).json({
    status: "success",
    updatedOrder,
  });
});
