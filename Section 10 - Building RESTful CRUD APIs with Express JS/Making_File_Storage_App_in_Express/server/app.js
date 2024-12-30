import express from "express";
import { createWriteStream } from "fs";
import { readdir, rename, rm, stat } from "fs/promises";


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




app.get('/directory/:dirname?',async(req,res)=>{

  const {dirname} =req.params;
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


app.get('/files/:filename',(req,res)=>{
  const {filename}= req.params;
  console.log(req.query);
  console.log(filename);

  if(req.query.action === 'download')
  {
    res.set("Content-Disposition", "attachment");
  }

  res.sendFile(`${import.meta.dirname}/storage/${filename}`);
})

app.post('/files/:filename',(req,res)=>{

  const {filename} = req.params;
  const writeStream = createWriteStream(`./storage/${filename}`);
  req.pipe(writeStream);
  req.on('end',()=>{
    res.json({message:"File uploaded successfully!!!"})
  })
})

app.delete('/files/:filename',async(req,res)=>{

  const {filename}= req.params;
  try{
    await rm(`./storage/${filename}`);
    res.json({message:"The file has been deleted.",OK:true});
  }
  catch(err){
    res.status(404).json({message:"The file has not found.",OK:false })
  }

})

app.patch('/files/:filename',async(req,res)=>{

  const {filename}= req.params;
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