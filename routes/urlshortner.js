var express = require("express");

var router=express.Router();
var mongoose=require("mongoose");

mongoose.connect('mongodb://localhost:27017'),{
    useNewUrlParser: true ,useUnifiedTopology: true
}



router.post('/', async function(req,res){
    res.render('index')
})





module.exports=router;