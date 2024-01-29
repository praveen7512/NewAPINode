import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema, loginSchema } from "../validator/authValidation.js";
import bcrypt from "bcrypt"
import "dotenv/config.js"
import jwt from "jsonwebtoken" 
import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";


class AuthController {

    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(registerSchema);
            const payload = await validator.validate(body);

            //check if the user exist or not

            const findUser = await prisma.users.findUnique({
                where : {
                    email : payload.email
                }
            });

            if(findUser){
                return res.status(400).json({
                    message : " User is already exits"
                })
            }



            //hashing the password

            const salt = bcrypt.genSaltSync(10);
            payload.password = bcrypt.hashSync(payload.password, salt);

            //create the user in db

            const user = await prisma.users.create({
                data : payload
            })
            console.log(payload);
            return res.status(200).json({
                message : "user created succesfully",
                user 
            });  
        } catch (error) {
            console.log(error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages)
                return  res.status(400).json({
                    message : "code phat gaya "
                })
            }
            else {
                return res.status(500).json({
                    message : "Internal Sever Error"
                })
            }
        }
    }

    static async login(req, res){
        try {
            const body = req.body;
            const validator = vine.compile(loginSchema);
            const payload = await validator.validate(body);

            // check if the user exit or not in the db

            const user = await prisma.users.findUnique({
                where : {
                    email : payload.email
                }
            })

            if(!user){
                return res.status(400).json({
                    message : "user not found"
                })
            }

            //check if the password is correct or not

            const correctPassword = await bcrypt.compare(payload.password, user.password);

            if(!correctPassword){
                
                return res.status(400).json({
                    message : "password is incorrect"
                })
            }

            //issue a token to user

            const payloadData = {
                id : user.id,
                name : user.name,
                email : user.email,
                profile : user.profile,
            }

            const token = await jwt.sign(payloadData, process.env.JWT_SECRET, {expiresIn : "1d"});

    
            return res.status(200).json({
                message : "login succesfully",
                access_token : `Bearer ${token}`
            })
        } catch (error) {
            console.log(error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages)
                return  res.status(400).json({
                    message : "code phat gaya "
                })
            }
            else {
                return res.status(500).json({
                    message : "Internal Sever Error"
                })
            }
        }
        
    }

    static async sentTestEmail(req, res){
        try {
            const {email} = req.query;
            const payload = [
                {
                  toEmail: email,
                  subject: "Hey I am just testing",
                  body: "<h1>Hello World , I am from Master backend series.</h1>",
                },
                {
                  toEmail: email,
                  subject: "You got an amazing",
                  body: "<h1>Hello bhaiya you got this amazing offer.</h1>",
                },
                {
                  toEmail: email,
                  subject: "Kadake ki pad rahi hai thand",
                  body: "<h1>Please apne ghar par rahe .</h1>",
                },
              ];
            
            await emailQueue.add(emailQueueName, payload);
          //  await sendEmail(payload.toEmail, payload.subject, payload.body);
            return res.json({
                status : 200,
                message : "Job added Succesfully"
            })
        } catch (error) {
            console.log(error)
             logger.error({
                type : "Email Error" , body : error.toString()
             });
             return res.status(500).json({
                 message : 'Something went wrong mere bhai',
                 dataError : error.toString()
             })
        }
    }


}

export default AuthController;
