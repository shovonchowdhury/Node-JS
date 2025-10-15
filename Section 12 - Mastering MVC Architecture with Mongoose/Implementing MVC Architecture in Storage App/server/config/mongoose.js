import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@54.211.110.36:27017/storageApp?authSource=admin&replicaSet=myReplicaSet");

