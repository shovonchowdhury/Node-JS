import express from "express";

import { mkdir, readdir, rename, rm, stat, writeFile } from "fs/promises";
import path from "path";

import directoriesData from "../directoriesDB.json" with {type:"json"};
import filesData from "../filesDB.json" with {type:"json"};
import { dir } from "console";
import filterInvalidID from "../middlewares/filterInvalidIDMiddleware.js";
import { Db, ObjectId } from "mongodb";

const router = express.Router();

router.param("id",filterInvalidID);
router.param("parentDirId",filterInvalidID)

router.get('/:id?',async(req,res)=>{

  // const {uid}=req.cookies;
  // const rootDir = directoriesData.find(dir=> dir.userId === uid)
  const id=req.params.id || req.user.rootDirId;
  console.log({id});
  const db  = req.db;

  const dirCollection = db.collection("directories");
  const fileCollection = db.collection("files");
  const directoryData =await dirCollection.findOne({_id: new ObjectId(String(id)) , userId: req.user._id})

  if(!directoryData) return res.status(404).json({error: "Directory not found or you do not have access to it!"})

  const files = await fileCollection.find({parentDirId : directoryData._id}).toArray();
  const directories = await dirCollection.find({parentDirId : directoryData._id}).toArray();
  console.log(directories);
  return res.status(200).json(
    {...directoryData,
      files: files.map((file)=> ({...file, id: file._id})),
      directories: directories.map(dir=> ({...dir,id:dir._id}))
    });
  

})

router.post('/:parentDirId?',async(req,res,next)=>{

   const {uid}=req.cookies;
   const db = req.db;
  // const rootDir = directoriesData.find(dir=> dir.userId === uid)

  const parentDirId = req.params.parentDirId || req.user.rootDirId ;
  console.log(parentDirId);
  const dirname = req.headers.dirname || 'New Folder';
  // const dirID = crypto.randomUUID();
  //const encryptedFullName = `${dirID}${extension}`;

  const dirCollection = db.collection("directories");
  const parentDir = await dirCollection.findOne({_id: new ObjectId(String(parentDirId))})

  if(!parentDir) 
    return res.status(404).json({message: "Parent Directory Does not exist!"})

  await dirCollection.insertOne({
    name : dirname,
    parentDirId,
    userId : req.user._id,
  })

  try{
    // await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
    return res.status(201).json({message:"Directory created successfully!!!"})
  }
  catch(err)
  {
    next(err);
  }
  
}
)

router.delete('/:id',async(req,res,next)=>{

  const {id}= req.params;
  console.log(id)
  const dirIndex = directoriesData.findIndex(directory=> directory.id === id);
  if(dirIndex === -1) {
    return res.status(404).json({message: "Directory has not Found!",OK:false})
  }
  const dirData = directoriesData[dirIndex];
  

  // Check if the directory belongs to the user
  if (dirData.userId !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to delete this directory!" });
  }
  
  //console.log(directoriesData,1)
  try{
    for (const fileID of dirData.files)
      {
        
        const fileIndex = filesData.findIndex((file)=> file.id === fileID);
        const expectedFile = filesData[fileIndex];
        console.log(expectedFile);
        filesData.splice(fileIndex, 1);
        await rm(`./storage/${fileID}${expectedFile.extension}`,{recursive:true});
        
    
      }
      //console.log(directoriesData,2)
    for (const dirID of dirData.directories)
      {
        const dirIndex = directoriesData.findIndex((dir)=> dir.id === dirID);
        directoriesData.splice(dirIndex, 1)
      }

      //console.log(directoriesData,3)
    const parentDirData = directoriesData.find((directoryData) => directoryData.id === dirData.parentDirId)
    parentDirData.directories = parentDirData.directories.filter((dirId) => dirId !== id)
    //console.log(directoriesData,4);
    directoriesData.splice(dirIndex,1);
    //console.log(directoriesData,4);
    

    await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
    await writeFile('./filesDB.json', JSON.stringify(filesData))
    return res.status(200).json({ message: "Directory Deleted Successfully!",OK:true });
    
  }
  
  catch(err){
    next(err);
    
  }


})


router.patch('/:id',async(req,res,next)=>{
  
  const {id} = req.params;
  const {newDirName}= req.body;
  
  const db = req.db;
  // const expectedDir = directoriesData.find((dir)=> dir.id === id)
  const dirCollection = db.collection("directories");
  // const expectedDir = await dirCollection.findOne({_id: new ObjectId(String(id))})

  // if(!expectedDir) 
  //   return res.status(404).json({message: "Directory not found!"})
  // console.log(filename,renameFile);

  
  try{
    
  
    const a = await dirCollection.updateOne({_id: new ObjectId(String(id)) , userId : req.user._id},{$set:{name:newDirName}})
    console.log(a);
    // await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
    return res.status(200).json({message:"The directory has been renamed.",OK:true});
  }
  catch(err){
    next(err);
  }

})


export default router;