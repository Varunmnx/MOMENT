import express  from "express";


import {signupUser,loginUser,isAuthenticateduser,logout,isuserAdmin,listallUsers,forgotpassword ,resetPassword ,userDetails,deleteUser, updateCurrentUser , detailedUser ,editExistingUser} from "../controllers/auth.js"


let router = express.Router()

// about me
router.get("/current",isAuthenticateduser,userDetails)
router.put("/profile/update",isAuthenticateduser,updateCurrentUser)
router.delete("/profile/deleteaccount",isAuthenticateduser,deleteUser)
router.post("/register",signupUser)
// router.put("/updatedetails")
router.post("/login",loginUser)
router.get("/logout",logout) 
router.post("/forgotpassword",forgotpassword)
router.put("/password/reset/:id",resetPassword)
router.get("/all",isAuthenticateduser,isuserAdmin("admin"),listallUsers)
router.route("/all/:id").delete(isAuthenticateduser,isuserAdmin("admin"),deleteUser)
                             .get(isAuthenticateduser,isuserAdmin("admin"),detailedUser)
                             .put(isAuthenticateduser,isuserAdmin("admin"),editExistingUser) // need to add functionality



export default router