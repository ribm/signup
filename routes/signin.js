var express = require("express");

var router=express.Router();

var {mongoClient,url,dbname,ObjectId}=require("../config");
const bcrypt = require('bcryptjs')


router.post('/', async function(req,res,next){
    console.log("hiii")
    console.log(req.body.password)

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
        //let activation_flag= await db.collection('user').findOne({user.active:true})
        //console.log(activation_flag)
        console.log(user.active)
        if (user){

           let result = await  bcrypt.compare(req.body.password,user.password)
           if (result && user.active==true) {
                client.close();
                res.json({message:"matched"})
               
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


module.exports=router












