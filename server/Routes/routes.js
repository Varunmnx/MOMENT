import express  from "express";
import {findAllProduct,productDetails, updateproduct ,createnewProduct, deleteProduct} from "../controllers/controller.js"
import {signupUser,loginUser,isAuthenticateduser,logout,isuserAdmin,listallUsers,forgotpassword ,resetPassword ,userDetails,deleteUser, updateCurrentUser , detailedUser ,editExistingUser} from "../controllers/auth.js"
import {addtoCart,deletecartItem,decreaseQuantity,clearCart} from "../controllers/shoppingcart.js"


let router = express.Router()
//user login and register
router.post("/user/register",signupUser)
router.post("/user/login",loginUser)
router.get("/logout",logout)
router.post("/forgotpassword",forgotpassword)
router.put("/password/reset/:id",resetPassword)

// about me
router.get("/me",isAuthenticateduser,userDetails)
router.put("/me/profile/update",isAuthenticateduser,updateCurrentUser)
router.delete("/me/profile/deleteaccount",isAuthenticateduser,deleteUser)

//user rating and comment section
router.route("/product/:id").get(isAuthenticateduser,productDetails).put(isAuthenticateduser,updateproduct).delete(isAuthenticateduser,isuserAdmin("admin"),deleteProduct)


// admin routes for user crud and product crud
router.get("/user/all",isAuthenticateduser,isuserAdmin("admin"),listallUsers)
router.route("/products/all").get(findAllProduct)

router.post("/products/new",isAuthenticateduser,isuserAdmin("admin"),createnewProduct)
router.route("/user/all/:id").delete(isAuthenticateduser,isuserAdmin("admin"),deleteProduct)
                             .get(isAuthenticateduser,isuserAdmin("admin"),detailedUser)
                             .put(isAuthenticateduser,isuserAdmin("admin"),editExistingUser) // need to add functionality

//routes to add items to cart
router.route("/cart").post(isAuthenticateduser,addtoCart)
                     .delete(isAuthenticateduser,deletecartItem)
                     .put(isAuthenticateduser,decreaseQuantity)

router.route("/cart/empty").delete(isAuthenticateduser,clearCart)
 // removing on e item from cart at a time // delete one item entirely
// adding to cart and increasing the quantity


export default router;