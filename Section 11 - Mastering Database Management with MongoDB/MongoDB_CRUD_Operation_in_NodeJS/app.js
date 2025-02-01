import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");

await client.connect();

const db = client.db("school");
const collection = db.collection("students");



//update a property of a data
const data = await collection.updateOne({name : 'Ani'},{$set:{talent:"Low"}});


console.log(data)

client.close();
