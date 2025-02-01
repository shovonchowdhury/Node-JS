import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");

await client.connect();

const db = client.db("school");
const collection = db.collection("students");

await collection.insertMany([{name : "Ronojoy" , talent : 'medium'},
    {name : "Araf" , talent : 'low'},
    {name : "Bilash" , talent : 'medium'},
])

client.close();
