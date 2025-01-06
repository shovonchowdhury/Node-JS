import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../filesDB.json" with {type:"json"};
import directoriesData from "../directoriesDB.json" with {type:"json"};


const router = express.Router();



router.get('/:id',(req,res)=>{

    const {id} = req.params;
   
    console.log(id);

    const expectedFile = filesData.find((file)=> file.id === id)
    if (!expectedFile) {
      return res.status(404).json({ message: "File Not Found!" });
    }
  
    if(req.query.action === 'download')
    {
      res.set("Content-Disposition", `attachment; filename=${expectedFile.name}`);
    }
  
    return res.sendFile(`${process.cwd()}/storage/${id}${expectedFile.extension}`,(err) => {
      if (!res.headersSent && err) {
        return res.json({ error: "File not found!" });
      }
    });
  })
  
  router.post('/:parentDirId?',(req,res,next)=>{
  
    const parentDirId =req.params.parentDirId || directoriesData[0].id;
    const filename = req.headers.filename || 'untitled';
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
        name : filename,
        parentDirId
      })
      try{
        const parentIdData = directoriesData.find((directoryData)=>
          directoryData.id === parentDirId
        )
        parentIdData.files.push(fileID);
  
  
        await writeFile('./filesDB.json',JSON.stringify(filesData));
        await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
  
        return res.status(201).json({message:"File uploaded successfully!!!"})
      }
      catch(err){
        next(err);
      }
      
    })
  })
  
  router.delete('/:id',async(req,res)=>{
  
    const {id} = req.params;
    const fileIndex = filesData.findIndex((file)=> file.id === id);
    if(fileIndex === -1) {
      return res.status(404).json({message: "File Not Found!",OK:false})
    }
    const expectedFile = filesData[fileIndex];
    
    try{
      await rm(`./storage/${id}${expectedFile.extension}`,{recursive:true});
      filesData.splice(fileIndex, 1);
      const parentDirData = directoriesData.find(directoryData=> directoryData.id===expectedFile.parentDirId)
      parentDirData.files = parentDirData.files.filter(fileId=> fileId !== id);
      await writeFile('./filesDB.json',JSON.stringify(filesData));
      await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));

      return res.json({message:"The file has been deleted.",OK:true});
    }
    catch(err){
      return res.status(404).json({message:"The file has not found.",OK:false })
    }
  
  })
  
  router.patch('/:id',async(req,res)=>{
  
    const {id} = req.params;
    const {newFilename}= req.body;
    const expectedFile = filesData.find((file)=> file.id === id)
    if (!expectedFile) {
      return res.status(404).json({ message: "File Not Found!" });
    }
    // console.log(filename,renameFile);
    try{
      expectedFile.name = newFilename;
      await writeFile('./filesDB.json',JSON.stringify(filesData))
      return res.json({message:"The file has been renamed.",OK:true});
    }
    catch(err){
      err.status = 500;
      next(err);
    }
  
  })

  export default router;