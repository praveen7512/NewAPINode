import express from "express";
import "dotenv/config";
import ApiRoutes from "./routes/api.js";
const app = express();
const PORT = process.env.PORT || 8000;


//middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.get("/", (req, res) => {
    return res.status(200).json({
        message : "Hello World"
    })
});

app.use("/api", ApiRoutes);

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);;
});
