import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Errorhandler } from "../utils/errorhandler.js";
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import bcrypt from "bcrypt"
import { userCreator,letuserlogin,appendResetTokenAndResetTokenExpire } from "../utils/userhelper.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/emailHelper.js";
import crypto from "crypto"
import cloudinary from "cloudinary"

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
    // jwt token
    let {token} = req.cookies
    if(!token){
      return next(new Errorhandler("please login to access the page",401))
    
    }
    // id is the key used in jwt authentication
    const decodedData=jwt.verify(token,process.env.JWT_SECRET)  //gives user id
    
    //user session info storing in user in client
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
          next( new Errorhandler(`Role ${req.user.role} is not authorized to make changes`,201))
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

// current user and admin can see user details
export const userDetails=asyncErrorhandler(async(req,res,next)=>{
          //user identifier to find the user in user db
          let {id} = req.user
          // fetching user with id  that we want details about
          let currentUser = prisma.user.findUnique(
                                                      {
                                                        where: {
                                                          id:id
                                                        }
                                                      }
                                                    )
          // if user not found return error
          if(!currentUser){
            next(new Errorhandler("user not found ",401))
          }
          // if user found then send success
          res.status(200).json({
            user:currentUser,
            status:"success"
          })
})


//delete useraccount by user

export const deleteUser =asyncErrorhandler(async(req,res,next)=>{
   let {id} = req.user
   let deleted = await prisma.user.delete({
                                              where:{
                                                id:id
                                              }
                                            })
  if(!deleted)next(new Errorhandler("user cannot be deleted no user exist in db",404))
  res.status(201).json({
    status:"success",
    deleted :deleted
  })
})



//update current user 

export const updateCurrentUser = asyncErrorhandler(async(req,res,next)=>{
  

  let { id , name , avatar , email } = req.user
  let file = req.files.photo

  let result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
                                                                        folder: "users",
                                                                        width: 150,
                                                                        crop: "scale",
                                                                      })
  let newImage = {
                    public_id:result.public_id,
                    url:result.url
                  } 

  let current = await prisma.user.findUnique(
                                                  {
                                                    where:{
                                                      id:id
                                                    }
                                                  }
                                                )

  if(!current){
    next(new Errorhandler("some error occured user not in db",401))
  }

  //if user donot wish to update his name and attributes then use the default one
  let updatedName = req.body.name  ?  req.body.name : name 
  let updatedAvatar = file ? newImage : avatar
  let updatedEmail = req.body.email ? req.body.password : email 

  // udpate users with the new values if there is or fix the old one
  let updateduser = await prisma.user.update({
                                                where:{
                                                  id:id
                                                },
                                                data:{  
                                                  name: updatedName ,       
                                                  avatar:updatedAvatar ,                      
                                                  email:updatedEmail ,          

                                                }
                                              })

  res.status(201).json({
    status:"success",
    user: updateduser
  })

})


export const deleteUserAsSuperUser =asyncErrorhandler(async(req,res,next)=>{
 let {id} = req.params
 let deleted = await prisma.user.delete({
                              where:{
                                id:id
                              }
                            })
  if(!deleted)next(new Errorhandler("User not found or something went wrong",404))

  res.status(201).json({
    status:"success",
    deleted
  })
})

export const detailedUser =asyncErrorhandler(async(req,res,next)=>{
  let {id} = req.params
  let currentuser = await prisma.user.findFirst({
    where:{
      id
    }
  })
  
  res.status(200).json({
    user:currentuser,
    status:"success"
  })

})


export const editExistingUser = asyncErrorhandler(async(req,res,next)=>{
  let {id} = req.params
  let currentuser = await prisma.user.findFirst({where:{
    id
  }})
  let name = req.body.name ? req.body.name : currentuser.name
  let role = req.body.role ? req.body.role : currentuser.role 

  let updateduser
  if( name||role ) {
  updateduser= await prisma.user.update({
                   where:{
                           id  },
                   data:{
                          name,
                          role  } } )}
                      
  if(!updateduser)next(new Errorhandler("something went wrong or this user donot exist ",401))
  res.status(201).json({
    user:updateduser,
    status:"success"
  })

})