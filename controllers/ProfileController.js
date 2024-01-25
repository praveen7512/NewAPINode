class ProfileController {

    static async index(req,res){
          return res.status(200).json(
            {
                message : " index route is working"
            }
          )
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