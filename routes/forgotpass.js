var express = require("express");

var router=express.Router();

var {mongoClient,url,dbname,ObjectId}=require("../config");
const bcrypt = require('bcryptjs')
var {transporter,mailOptions}=require("../mail.js");


router.post('/', async function(req,res,next){
    console.log("hiii")
    console.log(req.body.mail)

    let client;



    try {
        client = await mongoClient.connect(url);


        if (!client) {
            console.log("hiii--------------->")
            let db = client.db(dbname);
            
            
        } else {
        let db = client.db(dbname);
        console.log("hiii---------------> I am inside else")
        console.log(req.body.mail)
        if(db){
            console.log("i am the db ")
        }
        let user = await db.collection('user').findOne({mail:req.body.mail})
        let magic_number="20"
        var link = 'http://localhost:3000/'+"forgot_password/"+ magic_number;
        if (user){
           if (user.active==true) {
           let k= await db.collection('user').findOneAndUpdate({mail:req.body.mail},{$push:{"temprory_link" :link}});
           console.log(k)
                client.close();
                

                var mailOptions = {
                    from: 'kr151ranjan@gmail.com',
                    to: 'kr151ranjan@gmail.com',
                    subject: 'Registeration mail',
                    text: 'That was easy!',
                    html: '<p>Click _here <a href="' + link + '"</a> to reset your password</p>'
                  };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                res.json({message:"check your mail for reset link"})
               
           } else {
            client.close();
            res.json({message:"not matched, may be not activate  "})
           }

        }
        else{
            res.status(404).json({
                message:"not1 found"
            })
        }

            
        }
        
    } catch (error) {
        if(client){
            client.close()
            //console.log("none")
        }
        console.log(error)
    }
    
    })



                
router.get('/20',async function(req,res){
        magic_number="21"   //to deactivate
        //const queryString = window.location.search

        
        res.render('forgot')
        //res.json({messgae:"changed"})
    })

router.post('/update',async function(req,res){
    let client;
    try {
        // {mail:"kr151ranjan",password:"123"}
        //let userdata = req.body;
        //req.body._id=ObjectId()
        
        client = await mongoClient.connect(url);
        let db = client.db(dbname);
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt)
        req.body.password=hash
        //req.body['activateToken']=  crypto.AES.encrypt('my message', req.body.password).toString(); 
        //var link = 'http://localhost:3000/'+"activate/"+ req.body.activateToken;
        //console.log(link)
        await db.collection("user")
        .findOneAndUpdate({mail:req.body.mail},{$set:{"password" :req.body.password}});
        //await db.collection("user").insertOne(req.body)
        console.log(req.body);
        

        client.close();
        res.json({message:"password Changed"})
        
    
    } catch (error) {
        if(client){
            client.close()
        }
        console.log(error)
    }
    
    }

    )
module.exports=router