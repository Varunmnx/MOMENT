
import express  from "express";
let router = express.Router()
import {isAuthenticateduser} from "../controllers/auth.js"
import {addtoCart,deletecartItem,decreaseQuantity,clearCart,getcartState,} from "../controllers/shoppingcart.js"




//routes to add items to cart
router.route("/").post(isAuthenticateduser,addtoCart)
                 .delete(isAuthenticateduser,deletecartItem)
                 .put(isAuthenticateduser,decreaseQuantity)
                 .get(isAuthenticateduser,getcartState)

router.route("/empty").delete(isAuthenticateduser,clearCart)
 // removing on e item from cart at a time // delete one item entirely


export default router