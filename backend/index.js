let express = require("express");
let multer = require("multer");
let { MongoClient, ObjectId } = require("mongodb");
let path = require("path");
let fs = require("fs");
let cors = require("cors");
let cloudinary = require("cloudinary").v2;
let { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dd5ocdlrh",
    api_key: process.env.CLOUDINARY_API_KEY || "794465395558833",
    api_secret: process.env.CLOUDINARY_API_SECRET || "WE_yoeQyLZNUsj1PWAGmz6rJpFU"
});

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

// let storage = multer.diskStorage(
//     {
//         destination: (req,file,cb) => cb(null,"uploads/"),
//         filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
//   }
// );

let storage = new CloudinaryStorage({cloudinary});
let dalal = multer({storage});


const url = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017";

app.post("/upload",dalal.single("file"),(req,res) => 
{
    let client = new MongoClient(url);
    let db = client.db("insta");
    let collec = db.collection("photos");
    let obj = {
        username: req.body.username,
        caption: req.body.caption,
        file_url: req.file.path,
        file_name: req.file.filename,
        upload_time: new Date()
    }
    collec.insertOne(obj)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
})


app.get("/files", (req, res) => {
  let client = new MongoClient(url);
  let username = req.query.username;
  let obj = username?{username}:{};
      let db = client.db("insta");
      let collec= db.collection("photos");
      collec.find(obj).toArray()
    .then((result) => res.json(result))
    .catch((err) => {
      res.send(err);
    })
});

app.delete("/delete/:id",(req,res) => {
    let client = new MongoClient(url);
    let db = client.db("insta");
    let collec = db.collection("photos");
    let id = req.params.id; 
    let _id = new ObjectId(id);
    collec.findOne({_id})
    .then((obj) =>{
      // fs.promises.unlink(`uploads/${obj.file_name}`);
      cloudinary.uploader.destroy(obj.file_name);
      return collec.deleteOne({_id});
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
  });

app.listen(3000, () => {
  console.log("running on http://localhost:3000");
});