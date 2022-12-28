import express  from "express";

import {  isAuthenticateduser   ,userDetails  ,  deleteUser, updateCurrentUser } from "../controllers/auth.js"


let router = express.Router()

// about me
router.get("/",isAuthenticateduser,userDetails)
router.put("/profile/update",isAuthenticateduser,updateCurrentUser)
router.delete("/profile/deleteaccount",isAuthenticateduser,deleteUser)


export default router