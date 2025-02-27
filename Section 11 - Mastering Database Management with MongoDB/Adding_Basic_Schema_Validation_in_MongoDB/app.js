import { Collection, MongoClient } from "mongodb";

const client = new MongoClient('mongodb://localhost:27017/');

await client.connect();

const db = client.db();
const collections = db.collection("users");

await db.command(
    {
        collMod:'users',
        validator : {
            "name":{
              $type : "string"
            },
            "age":{
              $type : "int",
              $gte : 18,
              $lte : 50
            }
          }
    })

try{
    await collections.insertMany([
        {
            name: 'shovon',
            age : 25,
        },
        {
            name: 'dibbo',
            age : 16,
        }
    ])
}
catch(err){
    console.log(err);
}

client.close();