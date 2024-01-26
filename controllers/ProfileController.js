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

    }
    static async show(req,res){

    }
    static async update(req,res){
        
    }
    static async destroy(req,res){

    }
    
    
}

export default ProfileController;