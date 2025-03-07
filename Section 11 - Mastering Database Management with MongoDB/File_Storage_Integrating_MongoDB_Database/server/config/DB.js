import { MongoClient } from "mongodb";

 export const client = new MongoClient("mongodb://shovon:shovon123@localhost:27017/storageApp");



export async function connectDB() {

    await client.connect();

    const db = client.db();
    console.log("Database Connected");
    return db;
}

process.on("SIGINT",async()=>{
    await client.close();
    console.log("Client Disconnected!");
})