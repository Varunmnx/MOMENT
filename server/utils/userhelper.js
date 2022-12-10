import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt"
import { handleJWTSIGN } from "./JWThandler.js";



export async function userCreator(name,email,password,res){

    const salt = await bcrypt.genSalt()
    const hashedpassword = await bcrypt.hash(password,salt)
    const array = ["sleepy", "dead", "careless", "swag","clam","happy","angry","drunk","cute","artist","challenge","aged"];
    const shuffledArray = array.sort((a, b) => 0.5 - Math.random());
   let newuser= await prisma.user.create({data:{
        name,
        email,
        password:hashedpassword,
        avatar:{
          public_id:"",
          url:`https://avatars.dicebear.com/api/croodles/${shuffledArray[3]+shuffledArray[8]+shuffledArray[1]}.svg`
        }
      }})

      let token = handleJWTSIGN(newuser.id)
      let options ={
        expires: new Date( Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 *60 ),
        httpOnly:true
      }
      res.status(200).cookie("token",token,options).json({ success:true,newuser:true,token})
    return 
}


export async function letuserlogin(user,res){
    let token = handleJWTSIGN(user.id)
    let options ={
      expires: new Date( Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 *60 * 1000 ),
      httpOnly:true
    }
    res.status(201).cookie("token",token,options).json({
        status:true,
        user:user,
        token
      })
    return
}
