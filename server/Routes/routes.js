import express  from "express";
import {findAllProduct,productDetails, updateproduct ,createnewProduct} from "../controllers/controller.js"
import {signupUser,loginUser,isAuthenticateduser,logout} from "../controllers/auth.js"

let router = express.Router()
//user login and register
router.post("/user/register",signupUser)
router.post("/user/login",loginUser)
router.get("/logout",logout)
//product finding all and updation
router.get("/products/all",isAuthenticateduser,findAllProduct)
router.get("/products/:id",productDetails)
router.put("/products/:id",updateproduct)
router.post("/products/new",createnewProduct)
export default router;