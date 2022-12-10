// import { Errorhandler } from "../utils/errorhandler.js";

export const errorHandlerMiddleWare =(err,req,res,next)=>{
         err.statusCode = err.statusCode || 500;
         err.message = err.message || "server error"

         res.status(401).json({
            success:false,
            error:err.message,
            problemat:err.stack
         })
}