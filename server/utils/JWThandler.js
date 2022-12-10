import jwt from "jsonwebtoken";


export function handleJWTSIGN(id){
    return jwt.sign({ id:id },process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
}