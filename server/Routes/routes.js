import express  from "express";
import {findAllProduct,productDetails, updateproduct ,createnewProduct} from "../controllers/controller.js"
import {signupUser,loginUser,} from "../controllers/auth.js"

let router = express.Router()

router.post("/register",signupUser)
router.post("/signin",loginUser)
router.get("/products/all",findAllProduct)
router.get("/products/:id",productDetails)
router.put("/products/:id",updateproduct)
router.post("/products/new",createnewProduct)
export default router;