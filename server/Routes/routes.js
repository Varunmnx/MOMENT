import express  from "express";
import {findAllProduct,productDetails, updateproduct ,createnewProduct, deleteProduct} from "../controllers/controller.js"
import {signupUser,loginUser,isAuthenticateduser,logout,isuserAdmin,listallUsers,forgotpassword ,resetPassword ,userDetails,deleteUser, updateCurrentUser} from "../controllers/auth.js"

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
router.route("/products/:id").get(isAuthenticateduser,productDetails).put(isAuthenticateduser,updateproduct).delete(isAuthenticateduser,isuserAdmin("admin"),deleteProduct)


// admin routes for user crud and product crud
router.get("/user/all",isAuthenticateduser,isuserAdmin("admin"),listallUsers)
router.route("/products/all").get(isAuthenticateduser,isuserAdmin("admin"),findAllProduct)
router.post("/products/new",isAuthenticateduser,isuserAdmin("admin"),createnewProduct)
router.delete("/user/all/:id",isAuthenticateduser,isuserAdmin("admin"),) // need to add functionality
router.put("/user/all/:id",isAuthenticateduser,isuserAdmin("admin"))
export default router;