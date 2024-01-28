import prisma from "../DB/db.config.js";
import { generatorRandomNum, imageValidator } from "../utils/helper.js";

class ProfileController {

    static async index(req,res){

        try {
            return res.status(200).json(
                {
                    message : " index route is working",
                    data : req.user
                }
              )
        } catch (error) {
            return res.status(500).json({message : "Internal Server Error"})
        }
          
    }
    static async store(req,res){
          const user = req.user;
          const body = req.body;
          const validator = vine.compile
    }
    static async show(req,res){

    }
    static async update(req,res){ 
        try {
            
        const {id} = req.params;
        const authUser = req.user;

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({message : "Please upload image"})
        }

        const profile =  req.files.profile;
        console.log(profile.mimetype)
        const message = imageValidator(profile?.size , profile.mimetype);
        if(message !== null){
            return res.status(400).json({
                erros : {
                    profile : message
                }
            });
        }

        const imgExt = profile?.name.split(".");
        const imageName = generatorRandomNum() + "." + imgExt[1];
        const uploadPath = process.cwd() + "/public/images/" + imageName;

        profile.mv(uploadPath , (err) => {
            if((err)) {
                throw err;
            }
        })

        await prisma.users.update({
            data : {
                profile : imageName
            },
            where : {
                id : Number(id)
            }
        })


        return res.json(
            {
                name : profile.name,
                size : profile?.size,
                mime: profile?.mimetype,
                status : 200,
                message : "Profile photo updated Succesfully"

            }
        )
  
        } catch (error) {
            console.log(error)
            return res.status(500).json({message : "Internal Server Error"});
        }
     }
    static async destroy(req,res){

    }
    
    
}

export default ProfileController;