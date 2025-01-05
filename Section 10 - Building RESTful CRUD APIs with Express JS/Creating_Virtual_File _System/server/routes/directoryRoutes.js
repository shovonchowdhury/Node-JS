import express from "express";

import { mkdir, readdir, rename, rm, stat, writeFile } from "fs/promises";
import path from "path";

import directoriesData from "../directoriesDB.json" with {type:"json"};
import filesData from "../filesDB.json" with {type:"json"};

const router = express.Router();

router.get('/:id?',(req,res)=>{

  const {id}=req.params;
  if(!id)
  {
    const directoryData = directoriesData[0];
    const files = directoryData.files.map(fileId=>
      filesData.find(file=> file.id === fileId)
    )
    const directories = directoryData.directories.map(dirId=>
      directoriesData.find(directory=> directory.id === dirId)
    )
    res.json({...directoryData,files,directories});

  }
  else
  {
    const directoryData = directoriesData.find(directory => 
      directory.id === id
    );
    const files = directoryData.files.map(fileId=>
      filesData.find(files=> files.id === fileId)
    )
    const directories = directoryData.directories.map(dirId=>
      directoriesData.find(directory=> directory.id === dirId)
    )
    res.json({...directoryData,files,directories});
  }

})

router.post('/:parentDirId?',async(req,res)=>{

  const parentDirId = req.params.parentDirId || directoriesData[0].id  ;
  const dirname = req.headers.dirname;
  const dirID = crypto.randomUUID();
  //const encryptedFullName = `${dirID}${extension}`;

  try{
    const directoryData={
      id: dirID,
      name : dirname,
      parentDirId,
      files:[],
      directories:[]
    }
    directoriesData.push(directoryData);
    const parentDir = directoriesData.find((directory)=> directory.id === parentDirId);
    parentDir.directories.push(dirID);
    await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
    res.json({message:"Directory created successfully!!!"})
  }
  catch(err)
  {
    res.json({message: err.message});
  }
  
}
)

router.delete('/:id',async(req,res)=>{

  const {id}= req.params;
  const dirIndex = directoriesData.findIndex(directory=> directory.id === id);
  const dirData = directoriesData[dirIndex];
  
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
    res.json({ message: "Directory Deleted Successfully!",OK:true });
    
  }
  catch(err){
    res.status(404).json({message:"The directory has not found.",OK:false })
    
  }


})

export default router;