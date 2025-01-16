import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

import directoryRoutes from './routes/directoryRoutes.js';
import filesRoutes from './routes/filesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authCheck from "./middlewares/authMiddleware.js";
// import authCheck from "./auth.js";

const app= express();
const port = 4000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}));

app.use('/directory',authCheck,directoryRoutes);
app.use('/file',authCheck,filesRoutes);
app.use('/user',userRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: "Something went wrong!" });
});

app.listen(port,()=>{
  console.log(`Server running on port: ${port}.`);
})