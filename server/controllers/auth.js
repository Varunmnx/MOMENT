import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Errorhandler } from "../utils/errorhandler.js";
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import bcrypt from "bcrypt"
import { userCreator,letuserlogin,appendResetTokenAndResetTokenExpire } from "../utils/userhelper.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/emailHelper.js";
import crypto from "crypto"


export const signupUser =asyncErrorhandler(async(req,res,next)=>{

    try{
        const { name, email, password } = req.body

        const existing = await prisma.user.findFirst({  where: { email , } });
        
        if(!existing){
             await userCreator(name,email,password ,res)  }
        else{  
                next( new Errorhandler("existing user please login",200))
              }
      }catch(err){
      
        next(new Errorhandler(err.message,404))
      
      }
})


export const loginUser = asyncErrorhandler(async(req, res,next) => {
    const {email,password} = req.body

    const existing =await prisma.user.findFirst({
        where: {
         email,
        },
      }); 
     if(existing){
     
          if (existing&&await bcrypt.compare(password,existing.password) ){
                    await letuserlogin(existing,res)
            }
          
          else if(existing&&! await bcrypt.compare(password,existing.password)){
                next(new Errorhandler("forgotten password ?",201))
            }
            else{
              next(new Errorhandler("user donot exist sign up",404))
            }
        
      }else{
        next(new Errorhandler("user donot exist sign up",201))
      }
})

export const isAuthenticateduser =asyncErrorhandler(async(req,res,next)=>{
    let {token} = req.cookies
    if(!token){
      return next(new Errorhandler("please login to access the page",401))
    
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET)

    req.user = await prisma.user.findFirst({
      where:{
        id : decodedData.id
      }
    })
    next()
})

export const logout =asyncErrorhandler(async(req,res,next)=>{

       res.clearCookie("token").status(200).json({message:"logged out",success:true})
  })

export const isuserAdmin=(...roles)=>{  

  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
  
          next( new Errorhandler(`Role ${req.user.roles} is not authorized to make changes`,201))
    }
    next()
  }
}

export const listallUsers=asyncErrorhandler(async(req,res,next)=>{
    let allusers = await prisma.user.findMany()
    res.status(200).json({all:allusers})
})


export const forgotpassword = asyncErrorhandler(async(req,res,next)=>{

  let {email} = req.body
  let user = await prisma.user.findUnique({
    where:{
      email:email
    }
  })
 
  if(!user){
    next(new Errorhandler("no user found",404)) 
  }
    let updateduser = await appendResetTokenAndResetTokenExpire(email)
    const resetpasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${updateduser.resetPasswordToken}`
    const message = `Your password reset token is :- \n\n ${resetpasswordUrl} \n\n please go to this link to reset the password`
    try{
      //sendmail has to be created
          sendEmail({
                        email :updateduser.email,
                        subject : "password reset for Ecommerce website",
                        message
                      },next)
                      
          res.status(200).json({
            success:true,
            message:`Email sent to ${updateduser.email} please check your email to reset your password`
          })
        }catch(err){
              let user =await prisma.user.update({
                where:{
                  email:updateduser.email
                },
                data:{
                  resetPasswordExpire : "",
                  resetPasswordToken : ""
                }
              })
            console.log(user)
            next(new Errorhandler("unexpected email sending failure",404))
            }
          }
  )



export const resetPassword = asyncErrorhandler(async(req,res,next) =>{
  let newpassword = req.body.password
  console.log(newpassword)
  let {id} = req.params 
  let user = await prisma.user.findFirst({
                        where:{
                          resetPasswordToken :id
                        }
                      })
  console.log("____old__user___")
  console.log(user)
  let now = new Date( Date.now())

  const salt = await bcrypt.genSalt()
  const hashedpassword = await bcrypt.hash(newpassword,salt)


  if(!user){
    next(new Errorhandler("sorry your time is expired it seems or something went wrong",404)) }                
  if(user &&( Number( user.resetPasswordExpire ) >= Number( now )  ) ){

              let reseted = await prisma.user.update({
                                                        where:{
                                                          email:user.email
                                                        },
                                                        data:{
                                                          password: hashedpassword,
                                                          resetPasswordToken:"",
                                                          resetPasswordExpire:""
                                                        }
                                                        })
          
              res.status(200).json({
                reseted
              })
            }else{
              next(new Errorhandler("sorry your time has been expired",404))
            }

})