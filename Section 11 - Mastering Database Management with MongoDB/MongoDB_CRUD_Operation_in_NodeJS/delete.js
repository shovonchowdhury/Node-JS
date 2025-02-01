import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");

await client.connect();

const db = client.db("school");
const collection = db.collection("teachers");

// delete a data for a specific condition
// const data = await collection.deleteOne({talent :'low'}); 

//delete a property from a data
//const data = await collection.updateOne({talent :'low'},{$unset:{talent:""}});


// delete a collection
const data = await collection.drop();


console.log(data)

client.close();
