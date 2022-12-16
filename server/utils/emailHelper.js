import nodemailer from "nodemailer"

export  function sendEmail(maildetails,next){
  const { email , subject , message } = maildetails

   const transporter = nodemailer.createTransport({
                            host:process.env.HOST,
                            port:process.env.PORT,
                            service:"gmail",
                            auth:{
                                user: process.env.SMTP_MAIL,
                                pass:process.env.SMTP_PASS
                            }
                        })
    const mailoptions = {
                            from :process.env.SMTP_MAIL,
                            to: email,
                            subject: subject,
                            text: message
    }

    transporter.sendMail(mailoptions,(err,data)=>{
                                                        if(err){
                                                            console.log(err.message)
                                                        }else{
                                                            console.log(data)
                                                        }
                                                    }    
                                                       )

}