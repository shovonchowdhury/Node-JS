import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../filesDB.json" with {type:"json"};


const router = express.Router();



router.get('/:id',(req,res)=>{

    const {id} = req.params;
   
    console.log(id);

    const expectedFile = filesData.find((file)=> file.id === id)
  
    if(req.query.action === 'download')
    {
      res.set("Content-Disposition", "attachment");
    }
  
    res.sendFile(`${process.cwd()}/storage/${id}${expectedFile.extension}`,(err) => {
      if (err) {
        res.json({ error: "File not found!" });
      }
    });
  })
  
  router.post('/:filename',(req,res)=>{
  
    const {filename} =req.params;
    const fileID = crypto.randomUUID();
    const extension = path.extname(filename);
    const encryptedFullName = `${fileID}${extension}`;
    console.log(encryptedFullName);
    const writeStream = createWriteStream(`./storage/${encryptedFullName}`);
    req.pipe(writeStream);
    req.on('end',async()=>{

      filesData.push({
        id : fileID,
        extension,
        name : filename
      })

      await writeFile('./filesDB.json',JSON.stringify(filesData));

      res.json({message:"File uploaded successfully!!!"})
    })
  })
  
  router.delete('/:id',async(req,res)=>{
  
    const {id} = req.params;
    const fileIndex = filesData.findIndex((file)=> file.id === id);
    const expectedFile = filesData[fileIndex];
    try{
      await rm(`./storage/${id}${expectedFile.extension}`,{recursive:true});
      filesData.splice(fileIndex, 1);
      await writeFile('./filesDB.json',JSON.stringify(filesData));
      res.json({message:"The file has been deleted.",OK:true});
    }
    catch(err){
      res.status(404).json({message:"The file has not found.",OK:false })
    }
  
  })
  
  router.patch('/:id',async(req,res)=>{
  
    const {id} = req.params;
    const {newFilename}= req.body;
    const expectedFile = filesData.find((file)=> file.id === id)
    // console.log(filename,renameFile);
    try{
      expectedFile.name = newFilename;
      await writeFile('./filesDB.json',JSON.stringify(filesData))
      res.json({message:"The file has been renamed.",OK:true});
    }
    catch(err){
      res.status(404).json({message:err.message,OK:false })
    }
  
  })

  export default router;