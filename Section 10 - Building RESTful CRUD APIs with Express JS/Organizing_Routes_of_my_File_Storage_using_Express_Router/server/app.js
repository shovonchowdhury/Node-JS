import express from "express";
import { createWriteStream } from "fs";
import { mkdir, readdir, rename, rm, stat } from "fs/promises";
import path from "path";
import cors from 'cors';

import directoryRoutes from './routes/directoryRoutes.js';
import filesRoutes from './routes/filesRoutes.js';



const app= express();
const port = 4000;

app.use(express.json());
app.use(cors());


// app.use((req,res,next)=>{

//   res.set({
//     "Access-Control-Allow-Origin":"*",
//     "Access-Control-Allow-Methods": "*",
//     "Access-Control-Allow-Headers": "*",

//   });
//   next();

// })



//serving file without dinamic routing
// app.use((req,res,next)=>{
//   if (req.query.action === "download") {
//     res.set("Content-Disposition", "attachment");
//   }
//   console.log(req.query);
//   const serveStatic= express.static("storage");
//   serveStatic(req,res,next);
// })





app.use('/directory',directoryRoutes);

app.use('/files',filesRoutes);



app.listen(port,()=>{
  console.log(`Server running on port: ${port}.`);
})