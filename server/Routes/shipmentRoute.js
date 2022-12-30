import express from "express";
import { isAuthenticateduser, isuserAdmin } from "../controllers/auth.js"
import  { orderDetails , checkOut , listOrders ,removeOrder ,updateStatus} from "../controllers/billing.js"

let router = express.Router()

router.route("/").post(isAuthenticateduser,checkOut) // submitting a order request
                 .get(isAuthenticateduser,isuserAdmin("admin"),listOrders) // list all the orders
                 .delete(isAuthenticateduser,isuserAdmin("admin"),removeOrder)

router.route("/:id").get(isAuthenticateduser,orderDetails)
                    .put(isAuthenticateduser,updateStatus)

export default router