import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validator/newsValidation.js";
import { imageValidator , generatorRandomNum, bytesToMb, uploadImage, removeImage} from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import NewsApiTransformer from "../transform/NewsApiTransformer.js";

class NewsController {

    static async index (req,res){
            const page = Number(req.query.page) || 1;
            const limit = Number( req.query.limit) || 1;

            if(page <= 0 || limit <= 0){
                page = 1;
            }

            if(limit<=0 || limit>100)
            {
                limit = 10;
            }

            const skip = (page - 1) * limit

            try {
                const news = await prisma.news.findMany({
                    take : limit,
                    skip : skip,
                    include : {
                        user : {
                            select : {
                                id : true,
                                name : true,
                                profile : true
                            }
                        }
                    }
                });
                const newsTransform = news?.map(
                    (news) => NewsApiTransformer.transform(news)
                )

                const totalNews = await prisma.news.count();
                const totalPages = Math.ceil(totalNews / limit);
                return res.json({
                    status : 200,
                    newsTransform,
                    metadata : {
                        totalPages  : totalPages,
                        currentPage : page,
                        currentLimit : 1
                    }
                })

                
            } catch (error) {
                console.log(error);
                return res.status(500).json({message : "Internal Server Error at index news controller"})
            }
        
    }

        
    static async store (req,res){

          try {
          const user = req.user;
          const body = req.body;
          const validator = vine.compile(newsSchema);
          const payload = await validator.validate(body);

          if(!req.files || Object.keys(req.files).length === 0){
              return res.status(400).json({
               message : "Please upload image"
              })
          }

          const img = req.files.mera;
          console.log(img.size)
          
          const messageValidateImage = imageValidator(img?.size ,  img?.mimetype);
          console.log(bytesToMb(img?.size))
          if(messageValidateImage !==null){
              return res.status(400).json({
                  erros : {
                      message : messageValidateImage
                  }
              })
          }

        const imageName = uploadImage(img);

        payload.image = imageName;
        payload.user_id = user.id;



        const news = await prisma.news.create({
            data :  payload
            
        })

          return res.json({
            status : 200, 
            messge : "News Created Succesfully",
            news
          });
          } 
          catch (error) {
            console.log(error)
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages)
                return  res.status(400).json({
                    message : "code phat gaya "
                })
            }
            else {
                return res.status(500).json({
                    message : "Internal Sever Error",
                    error : error
                })
            }

          }
        
    }
    static async show  (req,res){
       try {
        const {id } = req.params;
        const news = await prisma.news.findUnique(
            {
                where : {
                    id : Number(id)
                },
                include :{
                    user : {
                        select : {
                            id : true, 
                            name : true, 
                            profile : true

                        }
                    }
                }
            }
        );
        const transformNews = news?.NewsApiTransformer.transform(news);
        return res.status(200).json({ news : transformNews});
       } catch (error) {
          reutrn.stauts(500).json({
            message : "Internal Server Error",
            error : error
          })
       }
    }
    static async update (req,res){
       
        try {
         
            const id  = req.params.id;
            console.log(id)
            const user = req.user;
            console.log(user)
            const news= await prisma.news.findUnique({
                where : {
                    id : Number(id)
                }
            })
    
            if(user.id !== news.user_id){
                return res.status(400).json({
                    message : "Unauthorized"
                })
            }
            const validator = vine.compile(newsSchema);
            const payload = await validator.validate(req.body);
            const image = req?.files?.img;
            console.log(image)
            let imageName = undefined;
    
    
            if((image)){
                const message = imageValidator(image?.size , image.mimetype);
                if(message!==null){
                    return res.status(400).json({
                        erros : {
                           image : message
                        }
                    })
                }
                imageName = uploadImage(image);
                payload.image = imageName;
            
            //remove the old image
                removeImage(news.image);
            }
            
    
            //upload the new image
            
            

            await prisma.news.update({
                data :   payload,
                where : {
                    id : Number(id)
                }    
            });

            return res.status(200).json({
                message : "News Updated Succesfully"
            })
        } catch (error) {
            
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages)
            }
            console.log(error)

            return res.status(500).json({
                message : "Internal Server Error",
            })


        }
    

    }
    static async destroy(req, res) {
        try {
          const { id } = req.params;
          const user = req.user;
          const news = await prisma.news.findUnique({
            where: {
              id: Number(id),
            },
          });
          if (user.id !== news?.user_id) {
            return res.status(401).json({ message: "UnAuthorized" });
          }
    
          // * Delete image from filesystem
          removeImage(news.image);
          await prisma.news.delete({
            where: {
              id: Number(id),
            },
          });
          return res.json({ message: "News deleted successfully!" });
        } catch (error) {
          return res.status(500).json({
            status: 500,
            message: "Something went wrong.Please try again.",
          });
        }
      }
    }
        

   


export default NewsController;