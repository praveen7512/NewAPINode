import express from "express";
import "dotenv/config";
import ApiRoutes from "./routes/api.js";
import fileUpload from "express-fileupload";
import { limiter } from "./config/ratelimiter.js";
import helmet from "helmet";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 8000;





//middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static("public"));
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 } // Set the limit according to your needs (10 MB in this example)
}));
app.use(helmet());
app.use(cors());
app.use((limiter));
app.use("/api", ApiRoutes);


app.get("/", (req, res) => {
    return res.status(200).json({
        message : "Hello World"
    })
});

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);;
});
