import express  from "express";
import {homePageFunction} from "../controllers/controller.js"
let router = express.Router()

router.get("/",homePageFunction)


export default router;