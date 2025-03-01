import { Collection, MongoClient } from "mongodb";

const client = new MongoClient('mongodb://localhost:27017/');

await client.connect();

const db = client.db();

const directoriesCollection = db.collection("directories");
const usersCollection = db.collection("users");

const session = client.startSession();
session.startTransaction();

try{
    await directoriesCollection.insertOne({name : 'folder' , userName : 'SC'},{session});
    await usersCollection.insertOne({name: 'SC', rootDir : 'folder'},{session});

    await session.commitTransaction()
}
catch(err)
{
    console.log(err);
    await session.abortTransaction();
}




await client.close()

console.log("Database Disconnected");