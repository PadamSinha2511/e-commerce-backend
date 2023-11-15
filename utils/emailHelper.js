const nodemailer = require("nodemailer")
const mailHelper = async (options)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
       
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      const message={
        from: 'padam@gmail.com', // sender address
        to: options.toEmail, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
     
      }

      await transporter.sendMail(message)
}


module.exports=mailHelper