import express from "express";
import { createWriteStream } from "fs";
import { mkdir, readdir, rename, rm, stat } from "fs/promises";
import path from "path";


const app= express();
const port = 4000;

// app.use(express.static("storage"));

// Enabling CORS
app.use((req,res,next)=>{

  res.set({
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",

  });
  next();

})

app.use(express.json());

//serving file without dinamic routing
// app.use((req,res,next)=>{
//   if (req.query.action === "download") {
//     res.set("Content-Disposition", "attachment");
//   }
//   console.log(req.query);
//   const serveStatic= express.static("storage");
//   serveStatic(req,res,next);
// })




app.get('/directory/?*',async(req,res)=>{

  const dirname = path.join('/',req.params[0]);
  console.log(dirname);
  const fullDirPath = `./storage/${dirname ? dirname : ''}`
  const fileList = await readdir(fullDirPath);
  console.log(fullDirPath);
  const resData=[];
  for(const item of fileList)
  {
    const stats= await stat(`${fullDirPath}/${item}`);
    resData.push({name:item, isDirectory: stats.isDirectory()});
    console.log('hello')
  }
  console.log(resData);
  res.json(resData);
}
)


app.post('/directory/?*',async(req,res)=>{

  const dirname = path.join('/',req.params[0]);
  try{
    await mkdir(`./storage/${dirname}`);
  }
  catch(err)
  {
    res.json({message: err.message});
  }
  
}
)




app.get('/files/*',(req,res)=>{
  console.log(req.params);
  const filename = path.join('/',req.params[0]);
  console.log(req.query);
  console.log(filename);

  if(req.query.action === 'download')
  {
    res.set("Content-Disposition", "attachment");
  }

  res.sendFile(`${import.meta.dirname}/storage/${filename}`);
})

app.post('/files/*',(req,res)=>{

  const filename = path.join('/',req.params[0]);
  const writeStream = createWriteStream(`./storage/${filename}`);
  req.pipe(writeStream);
  req.on('end',()=>{
    res.json({message:"File uploaded successfully!!!"})
  })
})

app.delete('/files/*',async(req,res)=>{

  const filename = path.join('/',req.params[0]);
  try{
    await rm(`./storage/${filename}`,{recursive:true});
    res.json({message:"The file has been deleted.",OK:true});
  }
  catch(err){
    res.status(404).json({message:"The file has not found.",OK:false })
  }

})

app.patch('/files/*',async(req,res)=>{

  const filename = path.join('/',req.params[0]);
  const {renameFile}= req.body;
  console.log(filename,renameFile);
  try{
    await rename(
      `./storage/${filename}`,
      `./storage/${renameFile}`
  );
    res.json({message:"The file has been renamed.",OK:true});
  }
  catch(err){
    res.status(404).json({message:err.message,OK:false })
  }

})

app.listen(port,()=>{
  console.log(`Server running on port: ${port}.`);
})