import express from "express";
import cors from 'cors';

import directoryRoutes from './routes/directoryRoutes.js';
import filesRoutes from './routes/filesRoutes.js';


const app= express();
const port = 4000;

app.use(express.json());
app.use(cors());


app.use('/directory',directoryRoutes);
app.use('/file',filesRoutes);



app.listen(port,()=>{
  console.log(`Server running on port: ${port}.`);
})