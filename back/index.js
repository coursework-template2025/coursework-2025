const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors')

app.use(express.static("public"));
app.use(bodyparser.json());
app.use(cors());

//mongodb://localhost:27017/test/kyrsach
mongoose.connect('mongodb://localhost:27017/kyrsach')
.then(()=>{console.log("connected")})
.catch((err)=>{console.log(err)})

const studSchema = new mongoose.Schema({
    name:String,
    pass:String,
    group:String,
    faculty:String,
    birth_date:String,
    status:String,
    picture:String
})
const newsSchema = new mongoose.Schema({
    created:String,
    author:String,
    head:String,
    body:String,
    links:[String]
})
const graphSchema = new mongoose.Schema({
    semester:String,
    group:String,
    monday:[String],
    tuesday:[String],
    wednesday:[String],
    thursday:[String],
    friday:[String],
})
const materialSchema = new mongoose.Schema({
    course:String,
    text:String,
    file_name:String,
    filse:String
})
const studModel = mongoose.model("student",studSchema);
const newsModel = mongoose.model("news",newsSchema);
const graphModel = mongoose.model("graphs", graphSchema);
const materialModel = mongoose.model("materials",materialSchema);

app.get("/",(req,res)=>{
    res.end("page");
})
app.get("/api/login",(req,res)=>{
    if (!req.query.userName || !req.query.password) {
        res.end("No");
    }
    console.log("logged")
    studModel.findOne({
        userName:req.query.userName,
        password:req.query.password
    })
    .then(data=>res.json(data))
    .catch(err=>console.log(err));
})
app.get("/api/getUsers",(req,res)=>{
    studModel.find({}).then(data=>res.json(data));
})
app.get("/api/getNews",(req,res)=>{
    newsModel.find({}).then(data=>res.json(data));
})
app.get("/api/getGraphs",(req,res)=>{
    graphModel.find({}).then(data=>res.json(data));
})
app.get("/api/getGraph",(req,res)=>{
    graphModel.findOne({group:req.query.group, semester:req.query.semester}).then(data=>res.json(data)).catch(err=>console.log(err));
})
app.get("/api/getMaterials",(req,res)=>{
    materialModel.find({}).then(data=>{console.log(data);res.json(data)}).catch(err=>console.log(err));
})
app.get("/api/addNews",(req,res)=>{
    let str = req.query.links;
    const new_news = new newsModel({
        created: Date.now(),
        author: req.query.author,
        head: req.query.head,
        body: req.query.body,
        links: str.split(",")
    })
    new_news.save();
})
app.listen(1337,()=>{ console.log("port 1337") })