import { MongoClient } from "mongodb";


const client = new MongoClient("mongodb://localhost:27017/");

await client.connect();

const db = client.db("expenseApp");
const collection = db.collection("expenses");

const cursor = collection.find({},{projection:{title: 1, amount : 1, _id:0}});
console.log(await cursor.toArray());

client.close();