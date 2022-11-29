import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export function homePageFunction(req,res){
    res.send("Hello")
}


export const getPosts= async(req,res)=>{
      try{

          const postMessages = await prisma.postMessage2.findMany()
          res.status(200).json(postMessages)
        
        }catch(err){
            console.error(err.message)
        }
}



export const createPost= async(req,res)=>{
    
    const post = {
                title:"Going to kerala",
                message:"my personal vacation on america",
                creator:"Varun Narayanan",
                tags:"Fun",
                selectedFile:"fun.png",
       };

      try{
                const newPost = await prisma.postMessage2.create( { data:post } )
                res.status(201).json(newPost)
      
            }catch(err){

                console.error(err.message)
      
            }
}