const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const path=require("path")
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
const cloudinary = require('cloudinary').v2;

//database
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}



//middlewares
dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"https://blog-43pq.onrender.com",credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)
app.use('/api/likes', likeRoutes);
//development
if(process.env.NODE_ENV==="production"){
    const dirPath=path.resolve();
    app.use(express.static("./frontend/dist"));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(dirPath,"./frontend/dist","index.html"));
    })
}
//image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        cloudinary.uploader.upload_stream(
            { folder: "your-folder-name" },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                res.status(200).json({ url: result.secure_url });
            }
        ).end(req.file.buffer);
    } catch (err) {
        res.status(500).json(err);
    }
});


app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})