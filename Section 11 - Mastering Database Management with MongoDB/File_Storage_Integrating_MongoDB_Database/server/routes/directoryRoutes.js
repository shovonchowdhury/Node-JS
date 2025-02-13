import express from "express";
import { mkdir, readdir, rename, rm, stat, writeFile } from "fs/promises";
import filterInvalidID from "../middlewares/filterInvalidIDMiddleware.js";
import { Db, ObjectId } from "mongodb";

const router = express.Router();

router.param("id",filterInvalidID);
router.param("parentDirId",filterInvalidID)

router.get('/:id?',async(req,res)=>{

  // const {uid}=req.cookies;
  // const rootDir = directoriesData.find(dir=> dir.userId === uid)
  const id=req.params.id || req.user.rootDirId;
  // console.log({id});
  const db  = req.db;

  const dirCollection = db.collection("directories");
  const fileCollection = db.collection("files");
  const directoryData =await dirCollection.findOne({_id: new ObjectId(String(id)) , userId: req.user._id})

  if(!directoryData) return res.status(404).json({error: "Directory not found or you do not have access to it!"})

  const files = await fileCollection.find({parentDirId : directoryData._id}).toArray();
  const directories = await dirCollection.find({parentDirId : directoryData._id}).toArray();
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
    parentDirId: parentDir._id,
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
  const db = req.db;

    const dirCollection = db.collection("directories");
    const fileCollection = db.collection("files");
    const dirData = await dirCollection.findOne({_id : new ObjectId(String(id)) , userId : req.user._id});
    if (!dirData) {
      return res.status(404).json({ message: "File Not Found!" });
    }
    
  try{

    let files=[];
    let directories= [];


    async function getNestedDirFiles(currentDir){

      const childFiles = await fileCollection.find({parentDirId : currentDir._id},{projection : {extension : 1}}).toArray();

      const childDirectories = await dirCollection.find({parentDirId : currentDir._id},{projection : {_id : 1}}).toArray();
      

      files = [...files,...childFiles];
      directories = [...directories, ...childDirectories];
      

      if(!childDirectories)
        return ;
    
      for(const dir of childDirectories)
      {
        await getNestedDirFiles(dir);
      }

      
    }

    await getNestedDirFiles(dirData);

    for(const file of files)
      {
        const fileID = file._id.toString();
        await rm(`./storage/${fileID}${file.extension}`,{recursive:true});
      }

    await fileCollection.deleteMany({_id : { $in: files.map(({_id})=> _id)}})
    await dirCollection.deleteMany({_id: { $in: [...directories.map(({ _id }) => _id), dirData._id] }});


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