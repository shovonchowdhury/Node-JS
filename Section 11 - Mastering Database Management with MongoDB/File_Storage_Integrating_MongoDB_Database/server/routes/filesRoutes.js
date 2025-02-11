import express from "express";
import { createWriteStream } from "fs";
import { rm } from "fs/promises";
import path from "path";
import filterInvalidID from "../middlewares/filterInvalidIDMiddleware.js";
import { ObjectId } from "mongodb";


const router = express.Router();

router.param("id",filterInvalidID)
router.param("parentDirId",filterInvalidID)

router.post('/:parentDirId?',async(req,res,next)=>{

  // const {uid}=req.cookies;
  // const rootDir = directoriesData.find(dir=> dir.userId === uid)

  const parentDirId =req.params.parentDirId || req.user.rootDirId;
  const filename = req.headers.filename || 'untitled';
  const db = req.db;

  const dirCollection = db.collection("directories");
  const parentDirData = await dirCollection.findOne({_id: new ObjectId(String(parentDirId)) , userId: req.user._id});
  console.log({parentDirData});

  if(!parentDirData)
  {
    return res.status(404).json({error : "Parent directory not found!!"});
  }

  const extension = path.extname(filename);

  const fileCollection = db.collection("files");
  const savedFile = await fileCollection.insertOne({
    extension,
    name : filename,
    parentDirId : parentDirData._id,
    userId: req.user._id
  })

  const fileID = savedFile.insertedId.toString();
  const encryptedFullName = `${fileID}${extension}`;

  const writeStream = createWriteStream(`./storage/${encryptedFullName}`);
  req.pipe(writeStream);
  req.on('end',async()=>{
    try{
      return res.status(201).json({message:"File uploaded successfully!!!"})
    }
    catch(err){
      next(err);
    }
    
  })
  req.on("error",async()=>{
    await fileCollection.deleteOne({_id : savedFile.insertedId});
    return res.status(404).json({error : "File not uploaded."});
  })
})


router.get('/:id',async(req,res)=>{

    const {id} = req.params;
    const db = req.db;

    const fileCollection = db.collection("files");
    const dirCollection = db.collection("directories");
    const fileData = await fileCollection.findOne({_id : new ObjectId(String(id)) , userId : req.user._id});
    if (!fileData) {
      return res.status(404).json({ message: "File Not Found!" });
    }
    
    const filePath = `${process.cwd()}/storage/${id}${fileData.extension}`;
  
    if(req.query.action === 'download')
    {
      // res.set("Content-Disposition", `attachment; filename=${expectedFile.name}`);
      return res.download(filePath,fileData.name);
    }
  
    return res.sendFile(filePath,(err) => {
      if (!res.headersSent && err) {
        return res.json({ error: "File not found!" });
      }
    });
  })
  
  
  router.delete('/:id',async(req,res)=>{
  
    const {id} = req.params;
    const db = req.db;

    const fileCollection = db.collection("files");
    const fileData = await fileCollection.findOne({_id : new ObjectId(String(id)) , userId : req.user._id});
    if (!fileData) {
      return res.status(404).json({ message: "File Not Found!" });
    }
   
    try{
      await rm(`./storage/${id}${fileData.extension}`,{recursive:true});
      await fileCollection.deleteOne({_id : fileData._id});
      
      // await writeFile('./filesDB.json',JSON.stringify(filesData));
      // await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));

      return res.json({message:"The file has been deleted.",OK:true});
    }
    catch(err){
      return res.status(404).json({message:"The file has not found.",OK:false })
    }
  
  })
  
  router.patch('/:id',async(req,res)=>{
  
    const {id} = req.params;
    const {newFilename}= req.body;
    const db = req.db;

    const fileCollection = db.collection("files");
    const fileData = await fileCollection.findOne({_id : new ObjectId(String(id)) , userId : req.user._id});
    if (!fileData) {
      return res.status(404).json({ message: "File Not Found!" });
    }
    // console.log(filename,renameFile);
    try{
     await fileCollection.updateOne({_id: new ObjectId(String(id)) , userId : req.user._id},{$set:{name:newFilename}})
      // await writeFile('./filesDB.json',JSON.stringify(filesData))
      return res.json({message:"The file has been renamed.",OK:true});
    }
    catch(err){
      err.status = 500;
      next(err);
    }
  
  })

  export default router;