import express  from "express";
import {findAllProduct,productDetails, updateproduct ,createnewProduct, deleteProduct} from "../controllers/controller.js"
import {signupUser,loginUser,isAuthenticateduser,logout,isuserAdmin,listallUsers,forgotpassword ,resetPassword ,userDetails,deleteUser, updateCurrentUser , detailedUser ,editExistingUser} from "../controllers/auth.js"

import {deleteReview,updateReview,addReview,getallReviews} from "../controllers/reviews.js"

let router = express.Router()
//user login and register
router.post("/user/register",signupUser)
router.post("/user/login",loginUser)
router.get("/logout",logout) // logout deletes token stored in cookies inorder to prevent validation in isAuthenticateduser function
router.post("/forgotpassword",forgotpassword)
router.put("/password/reset/:id",resetPassword)



//user rating and comment section
router.route("/product/:id").get(isAuthenticateduser,productDetails)
                            .put(isAuthenticateduser,updateproduct)
                            .delete(isAuthenticateduser,isuserAdmin("admin"),deleteProduct)


// admin routes for user crud and product crud
router.get("/user/all",isAuthenticateduser,isuserAdmin("admin"),listallUsers)
router.route("/products/all").get(findAllProduct)

router.post("/products/new",isAuthenticateduser,isuserAdmin("admin"),createnewProduct)
router.route("/user/all/:id").delete(isAuthenticateduser,isuserAdmin("admin"),deleteUser)
                             .get(isAuthenticateduser,isuserAdmin("admin"),detailedUser)
                             .put(isAuthenticateduser,isuserAdmin("admin"),editExistingUser) // need to add functionality


 
router.route("/comments/new").post(isAuthenticateduser,addReview)
                             .put(isAuthenticateduser,updateReview)
                             .delete(isAuthenticateduser,deleteReview)
router.route("/comments/all").get(getallReviews)

export default router;