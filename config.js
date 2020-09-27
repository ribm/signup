const mongodb = require("mongodb");
const mongoClient= mongodb.MongoClient;
const url = "mongodb://localhost:27017"
const dbname="Signup";
const ObjectId= mongodb.ObjectID
var crypto = require('crypto');
module.exports={mongoClient,url,dbname, ObjectId};