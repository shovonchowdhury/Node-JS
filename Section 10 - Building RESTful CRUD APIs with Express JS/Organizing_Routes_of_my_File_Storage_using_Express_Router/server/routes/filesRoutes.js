import express from "express";
import { createWriteStream } from "fs";
import { rename, rm } from "fs/promises";
import path from "path";


const router = express.Router();



router.get('/*',(req,res)=>{
    console.log(req.params);
    const filename = path.join('/',req.params[0]);
    console.log(req.query);
    console.log(filename);
  
    if(req.query.action === 'download')
    {
      res.set("Content-Disposition", "attachment");
    }
  
    res.sendFile(`${process.cwd()}/storage/${filename}`);
  })
  
  router.post('/*',(req,res)=>{
  
    const filename = path.join('/',req.params[0]);
    const writeStream = createWriteStream(`./storage/${filename}`);
    req.pipe(writeStream);
    req.on('end',()=>{
      res.json({message:"File uploaded successfully!!!"})
    })
  })
  
  router.delete('/*',async(req,res)=>{
  
    const filename = path.join('/',req.params[0]);
    try{
      await rm(`./storage/${filename}`,{recursive:true});
      res.json({message:"The file has been deleted.",OK:true});
    }
    catch(err){
      res.status(404).json({message:"The file has not found.",OK:false })
    }
  
  })
  
  router.patch(' /*',async(req,res)=>{
  
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

  export default router;