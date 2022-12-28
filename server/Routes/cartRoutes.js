
import express  from "express";
import {isAuthenticateduser} from "../controllers/auth.js"
import {addtoCart,deletecartItem,decreaseQuantity,clearCart} from "../controllers/shoppingcart.js"


let router = express.Router()


//routes to add items to cart
router.route("/").post(isAuthenticateduser,addtoCart)
                 .delete(isAuthenticateduser,deletecartItem)
                 .put(isAuthenticateduser,decreaseQuantity)

router.route("/empty").delete(isAuthenticateduser,clearCart)
 // removing on e item from cart at a time // delete one item entirely


export default router