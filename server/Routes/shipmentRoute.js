import express from "express";
import { isAuthenticateduser, isuserAdmin } from "../controllers/auth.js"
import  { orderDetails , checkOut , listOrders } from "../controllers/billing.js"

let router = express.Router()

router.route("/").put(isAuthenticateduser,checkOut) // submitting a order request
                 .get(isAuthenticateduser,isuserAdmin("admin"),listOrders) // list all the orders
                 .delete(isAuthenticateduser,isuserAdmin("admin"))

router.route("/:id").get(isAuthenticateduser,orderDetails)


export default router