import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb://localhost:27017/');

await client.connect();

const admin = client.db().admin();


const allDBs = await admin.listDatabases();



console.log(allDBs);

client.close()     //for close the connection from server