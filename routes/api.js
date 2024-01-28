import {Router} from 'express'
import AuthController from '../controllers/AuthController.js'
import ProfileController from '../controllers/ProfileController.js';
import authMiddleware from '../middleware/Authenticate.js'
import NewsController from '../controllers/NewsController.js';
import redisCache from '../DB/redis.config.js';


const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

//procted route hai yeh
router.get("/profile", authMiddleware, ProfileController.index);
router.put("/profile/:id", authMiddleware, ProfileController.update);

//News Routes
router.get("/News",redisCache.route({expire: 60*30}), NewsController.index);
router.post("/News",authMiddleware, NewsController.store);
router.get("/News/:id", NewsController.show);
router.put("/News/:id",authMiddleware, NewsController.update);
router.delete("/News/:id",authMiddleware, NewsController.destroy);


export default router;