import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../filesDB.json" with {type:"json"};
import directoriesData from "../directoriesDB.json" with {type:"json"};
import filterInvalidID from "../middlewares/filterInvalidIDMiddleware.js";


const router = express.Router();

router.param("id",filterInvalidID)
router.param("parentDirId",filterInvalidID)

router.post('/:parentDirId?',(req,res,next)=>{

  // const {uid}=req.cookies;
  // const rootDir = directoriesData.find(dir=> dir.userId === uid)

  const parentDirId =req.params.parentDirId || req.user.rootDirId;
  const filename = req.headers.filename || 'untitled';
  const db = req.db;
  // const fileID = crypto.randomUUID();
  // const extension = path.extname(filename);
  // const encryptedFullName = `${fileID}${extension}`;
  // console.log(encryptedFullName);
  const fileCollection = db.collection("files");
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


router.get('/:id',(req,res)=>{

    const {id} = req.params;
    console.log(id);
    const fileData = filesData.find(file=> file.id === id);
    const parentDir = directoriesData.find(dir=> dir.id === fileData.parentDirId);

    if(parentDir.userId !== req.user.id)
    {
      return res.status(401).json({ error: "You are not eligible to access this file." });
    }

    const expectedFile = filesData.find((file)=> file.id === id)
    if (!expectedFile) {
      return res.status(404).json({ message: "File Not Found!" });
    }

    const filePath = `${process.cwd()}/storage/${id}${expectedFile.extension}`;
  
    if(req.query.action === 'download')
    {
      // res.set("Content-Disposition", `attachment; filename=${expectedFile.name}`);
      return res.download(filePath,expectedFile.name);
    }
  
    return res.sendFile(filePath,(err) => {
      if (!res.headersSent && err) {
        return res.json({ error: "File not found!" });
      }
    });
  })
  
 
  
  router.delete('/:id',async(req,res)=>{
  
    const {id} = req.params;
    const fileIndex = filesData.findIndex((file)=> file.id === id);
    if(fileIndex === -1) {
      return res.status(404).json({message: "File Not Found!",OK:false})
    }
    const expectedFile = filesData[fileIndex];

    const parentDir = directoriesData.find((dir) => dir.id === expectedFile.parentDirId);
    if (!parentDir) {
      return res.status(404).json({ error: "Parent directory not found!" });
    }
    if (parentDir.userId !== req.user.id) {
      return res.status(403).json({ error: "You don't have access to this file." });
    }
    
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

    // Check parent directory ownership
    const parentDir = directoriesData.find((dir) => dir.id === expectedFile.parentDirId);
    if (!parentDir) {
      return res.status(404).json({ error: "Parent directory not found!" });
    }
    if (parentDir.userId !== req.user.id) {
      return res.status(403).json({ error: "You don't have access to this file." });
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