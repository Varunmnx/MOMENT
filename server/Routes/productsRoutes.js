import {findAllProduct,productDetails, updateproduct ,createnewProduct, deleteProduct} from "../controllers/controller.js"
import { isAuthenticateduser,isuserAdmin } from "../controllers/auth.js"

import express from "express"

let router = express.Router()


router.route("/products/all").get(findAllProduct)

router.post("/products/new",isAuthenticateduser,isuserAdmin("admin"),createnewProduct)

router.route("/product/:id").get(isAuthenticateduser,productDetails)
                            .put(isAuthenticateduser,updateproduct)
                            .delete(isAuthenticateduser,isuserAdmin("admin"),deleteProduct)

export default router