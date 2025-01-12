import express from "express";

import { mkdir, readdir, rename, rm, stat, writeFile } from "fs/promises";
import path from "path";

import directoriesData from "../directoriesDB.json" with {type:"json"};
import filesData from "../filesDB.json" with {type:"json"};
import { dir } from "console";

const router = express.Router();

router.get('/:id?',(req,res)=>{

  // const {uid}=req.cookies;
  // const rootDir = directoriesData.find(dir=> dir.userId === uid)
  const id=req.params.id || req.user.rootDirId;
  
  
    const directoryData = directoriesData.find(directory => 
      directory.id === id && directory.userId === req.user.id
    );
    if(!directoryData) return res.status(404).json({error: "Directory not found or you do not have access to it!"})

    const files = directoryData.files.map(fileId=>
      filesData.find(files=> files.id === fileId)
    )
    const directories = directoryData.directories.map(dirId=>
      directoriesData.find(directory=> directory.id === dirId)
    )
    return res.status(200).json({...directoryData,files,directories});
  

})

router.post('/:parentDirId?',async(req,res,next)=>{

   const {uid}=req.cookies;
  // const rootDir = directoriesData.find(dir=> dir.userId === uid)

  const parentDirId = req.params.parentDirId || req.user.rootDirId ;
  const dirname = req.headers.dirname || 'New Folder';
  const dirID = crypto.randomUUID();
  //const encryptedFullName = `${dirID}${extension}`;

  const directoryData={
    id: dirID,
    name : dirname,
    parentDirId,
    userId:uid,
    files:[],
    directories:[]
  }
  directoriesData.push(directoryData);
  const parentDir = directoriesData.find((directory)=> directory.id === parentDirId);
  if(!parentDir) 
    return res.status(404).json({message: "Parent Directory Does not exist!"})
  parentDir.directories.push(dirID);
  try{
    await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
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
  const dirIndex = directoriesData.findIndex(directory=> directory.id === id);
  if(dirIndex === -1) {
    return res.status(404).json({message: "Directory has not Found!",OK:false})
  }
  const dirData = directoriesData[dirIndex];

  // Check if the directory belongs to the user
  if (dir.userId !== req.user.id) {
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
  const {newDirname}= req.body;
  const expectedDir = directoriesData.find((dir)=> dir.id === id)
  if(!expectedDir) 
    return res.status(404).json({message: "Directory not found!"})
  // console.log(filename,renameFile);

  if (expectedDir.userId !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to delete this directory!" });
  }
  try{
    expectedDir.name = newDirname;
    await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
    return res.status(200).json({message:"The directory has been renamed.",OK:true});
  }
  catch(err){
    next(err);
  }

})


export default router;