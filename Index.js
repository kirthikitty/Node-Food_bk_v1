    const express = require('express')
    const app = express()
    const mongoose = require("mongoose")
    const router = express.Router()
    const cors = require("cors")
    app.use(express.json())
    app.use(cors({origin:"*"}))
 

    // const multer = require('multer')
    // const path = require('path')

    app.use("/public",express.static(__dirname + "/public"))

    // const storage = multer.diskStorage({
    //     destination: function(req,file,cb){
    //         cb(null,'./public/data/uploads/')
    //     },
    //     filename: function(req,file,cb){
    //         cb(null,Date.now() + path.extname(file.originalname))
    //     }
    // })

    // const uploader = multer({storage : storage});

    // app.post('/upload/single',uploader.single('uploaded_file'),function(req,res){
    //     console.log(req.file, req.body)
    //     res.status(200).send()
    // });
    // app.post("/upload/multiple",uploader.array("uploaded_file",10),(req,res)=>{
    //     console.log(req.files)
    //     return res.send("Multiple files Uploaded succesfully...!")
    // })


    const PORT = process.env.PORT || 8080;
    const MONGODB_URL = "mongodb://localhost:27017/food"

    mongoose.connect(MONGODB_URL)
    .then(()=>{
        console.log(`${MONGODB_URL} connection Successfull...`)
    })
    .catch((err)=>{
        console.error("Error in connecting to mongodb",err.message)
    })

    app.use(router)
    const menuItemRouter = require("./Router/MenuItemRoute.js")
    app.use(menuItemRouter)

    app.use(require("./Controller/UserController.js"))




    // const verifyToken = require("./Middleware/AuthMiddleware.js")
    // app.use(require("./Controller/AuthController.js"))

    // app.use("/unprotected",(req,res)=>{
    //     res.status(200).send("This is an unprotected API")
    // })
    // app.use("/protected",verifyToken, (req,res)=>{
    //     res.status(200).send("This is a protected API")
    // })



    app.listen(PORT,()=>{
        console.log(`server listening on ${PORT}...`)
    })

