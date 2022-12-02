import express  from "express";
import {signupUser,loginUser } from "../controllers/controller.js"
let router = express.Router()

router.post("/register",signupUser)
router.post("/signin",loginUser)

export default router;