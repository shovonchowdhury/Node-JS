import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");

await client.connect();

const db = client.db("school");
const collection = db.collection("students");

// read all data without any condition
// const data = await collection.find().toArray(); 

// read all data with condition
//  const data = await collection.find({$or : [{talent : 'medium'},{talent : 'High'}]}).toArray(); 
 const data = await collection.find({talent : {$in : ['medium','High']}}).toArray(); 
// const data = await collection.find({_id : new ObjectId("679e7583e027d452f5dda87d")}).toArray(); 

console.log(data)

client.close();
