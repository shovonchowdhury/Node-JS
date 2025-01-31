import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb://localhost:27017/');

await client.connect();

const db = client.db("expenseApp");

//const collectionList = await db.listCollections().toArray()
const collection = db.collection("phones");

const phones = await collection.find().toArray();


console.log(phones);