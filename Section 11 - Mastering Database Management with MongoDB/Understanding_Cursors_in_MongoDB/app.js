import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");

await client.connect();

const db = client.db("todoApp");
const collection = db.collection("todos");


//******for insert some documents */

// const tasks=[];
// for(let i=1;i<=25;i++)
// {
//     tasks.push({title : `Task ${i}`, completed : (i%2) ? true : false});
// }
// await collection.insertMany(tasks);



//now understand cursors
const cursor = collection.find() //not calling DB

// for await( const document of cursor)
//     console.log(document);

console.log(await cursor.hasNext()) //calling DB; return true if there is documents left.
console.log(await cursor.next()); //calling DB; pointing first document.
console.log(await cursor.next()); //calling DB; pointing second document.

console.log(await cursor.toArray()); // calling DB; return remaining all document with array
console.log(await cursor.hasNext()) //calling DB; return false if there is no documents left.






client.close();

