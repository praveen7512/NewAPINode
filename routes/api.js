import {Router} from 'express'
import AuthController from '../controllers/AuthController.js'
import ProfileController from '../controllers/ProfileController.js';
import authMiddleware from '../middleware/Authenticate.js'


const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

//procted route hai yeh
router.get("/profile", authMiddleware, ProfileController.index);


export default router;