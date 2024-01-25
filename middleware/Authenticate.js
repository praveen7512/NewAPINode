import jwt from 'jsonwebtoken';


const authMiddleware  = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    //check if the authHeader is valid or not
    if( authHeader === null || authHeader === undefined){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }
    const token = authHeader.split(" ")[1];

    //verify the token
    jwt.verify(token , process.env.JWT_SECRET , (err, user)=>{
        if(err){
            return res.status(403).json({
                message : "Forbidden"
            })
        }
        req.user = user;
        next();
        
    });
}

export default authMiddleware;