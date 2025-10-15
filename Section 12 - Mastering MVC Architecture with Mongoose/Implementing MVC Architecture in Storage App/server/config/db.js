import mongoose from "mongoose";


export async function connectDB() {
  
  try {
    await mongoose.connect("mongodb://admin:admin@54.211.110.36:27017/storageApp?authSource=admin&replicaSet=myReplicaSet");
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Client Disconnected!");
  process.exit(0);
});
