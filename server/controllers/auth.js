import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Errorhandler } from "../utils/errorhandler.js";
import { asyncErrorhanlder } from "../middlewares/asyncErrorhandler.js";

import bcrypt from "bcrypt"



export const signupUser =asyncErrorhanlder(async(req,res,next)=>{

    try{
        const { name, email, password } = req.body

        const existing = await prisma.user.findFirst({
            where: { email , },});

          if(!existing){
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

            res.status(200).json(
                   {newuser:true,newuser})
              }

          else{
                  res.status(404).json({
                      existing:true,
                      existing
                    })
              }
          
    }catch(err){
      next(new Errorhandler(err.message,404))
    }
})


export const loginUser = asyncErrorhanlder(async(req, res,next) => {
    const {email,password} = req.body
    console.log(req.body)
    const existing =await prisma.user.findFirst({
        where: {
         email,
        },
      }); 
     if(existing){
     try{
          console.log("existing runned")
          if (existing&&await bcrypt.compare(password,existing.password) ){
                  res.status(201).json({
                  status:true,
                  data:{
                    name:existing.name,
                    email:existing.email
                  }})
            }
          
          else if(existing&&! await bcrypt.compare(password,existing.password)){
                  res.status(401).json({
                    message:"wrong password"
                  })
            }
            else{
              next(new Errorhandler("user donot exist sign up",404))
            }
        }
     catch(err){
         next(new Errorhandler(err,404))
      }
    }else{
      res.status(201).json({
        status:false,
        user:{
          name:"",
          email:""
        }
      })
    }
})