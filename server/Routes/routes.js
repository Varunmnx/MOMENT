import express  from "express";
import {findAllProduct,productDetails, updateproduct ,createnewProduct, deleteProduct} from "../controllers/controller.js"
import {signupUser,loginUser,isAuthenticateduser,logout,isuserAdmin,listallUsers,forgotpassword } from "../controllers/auth.js"

let router = express.Router()
//user login and register
router.post("/user/register",signupUser)
router.post("/user/login",loginUser)
router.get("/logout",logout)
router.post("/forgotpassword",forgotpassword)
// router.post("/resetpassword",resetPassword)
router.get("user/all",isAuthenticateduser,isuserAdmin("admin"),listallUsers)
//product finding all and updation
router.route("/products/all").get(isAuthenticateduser,isuserAdmin("admin"),findAllProduct)
router.route("/products/:id").get(isAuthenticateduser,productDetails).put(isAuthenticateduser,updateproduct).delete(isAuthenticateduser,isuserAdmin("admin"),deleteProduct)
router.post("/products/new",isAuthenticateduser,isuserAdmin("admin"),createnewProduct)
export default router;