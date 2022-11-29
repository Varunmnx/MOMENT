import express  from "express";
import { homePageFunction, getPosts,createPost } from "../controllers/controller.js"
let router = express.Router()

router.get("/",homePageFunction)
router.get("/messages",getPosts)
router.get("/post",createPost)
export default router;