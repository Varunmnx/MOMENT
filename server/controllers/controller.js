import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt"

export function homePageFunction(req, res) {
  res.send("Hello");
}


export const sendpara = (req, res) => {
  res.json(req.body);
  console.log(req.query);
  console.log(req.params);
};

export const signupUser =async(req,res)=>{
    try{
        const { name, email, password } = req.body

        const existing = await prisma.user.findFirst({
            where: { email , },});
         console.log(existing)

          if(!existing){
            const salt = await bcrypt.genSalt()
            const hashedpassword = await bcrypt.hash(password,salt)

            await prisma.user.create({data:{
                name,
                email,
                password:hashedpassword
              }})

            res.status(200).json(
                   {newuser:true})
              }

          else{
                  res.status(404).json({
                      existing:true
                    })
              }
          
    }catch(err){
        console.error(err)
    }
}


export const loginUser = async(req, res) => {
    const {email,name,password} = req.body
    const existing =await prisma.user.findFirst({
        where: {
         email,
        },
      }); 

     try{
          if (await bcrypt.compare(password,existing.password) ){
                  res.status(201).json({
                  message:"hello "+existing.name+" !",})
            }
          
          else if(existing&&! await bcrypt.compare(password,existing.password)){
                  res.status(401).json({
                    message:"wrong password"
                  })
            }
        }
     catch(err){
            res.send("failure")
            console.log(err)
      }
};
