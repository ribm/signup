var express = require("express");

var router=express.Router();
var crypto = require('crypto-js');

var {mongoClient,url,dbname,ObjectId}=require("../config");
var {transporter,mailOptions}=require("../mail.js");
const bcrypt = require('bcryptjs')


router.post('/', async function(req,res,next){
    
    let client;
    try {
        // {name:"Ranjan",email:"kr151ranjan",password:"123"}
        let userdata = req.body;
        req.body._id=ObjectId()
        
        client = await mongoClient.connect(url);
        let db = client.db(dbname);
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt)
        req.body.password=hash
        req.body['active']={
            type: Boolean,
            default: false
        }
        req.body['activateToken']=  crypto.AES.encrypt('my message', req.body.password).toString(); 
        var link = 'http://localhost:3000/'+"signup/"+ req.body.activateToken;
        console.log(link)
        await db.collection("user").insertOne(req.body)
        console.log(req.body);
        var mailOptions = {
            from: 'kr151ranjan@gmail.com',
            to: 'kr151ranjan@gmail.com',
            subject: 'Registeration mail',
            text: 'That was easy!',
            html: '<p>Click <a href="' + link + '"</a> to set your password</p>'
          };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        client.close();
        res.json({message:"Registered"})
        
    
    } catch (error) {
        if(client){
            client.close()
        }
        console.log(error)
    }
    
    })

router.get("/:activeToken/",  async function(req,res,next){
    console.log("hii")
    let client;
    try {
        
        let  to_be_matched=crypto.AES.decrypt('my message', req.params.activeToken).toString();
        client = await mongoClient.connect(url);
        let db = client.db(dbname);
        await db.collection("user")
        .findOneAndUpdate({activateToken:req.params.activeToken},{$set:{"active" :true}});
        client.close();
        //console.log(req.body.name);
        client.close();



        res.json({message:"activated"})
        
    
    } catch (error) {
        if(client){
            client.close()
        }
        console.log(error)
    }

})













module.exports=router








