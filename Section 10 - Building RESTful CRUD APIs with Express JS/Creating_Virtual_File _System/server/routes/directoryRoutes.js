import express from "express";

import { mkdir, readdir, rename, rm, stat } from "fs/promises";
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
      filesData.find(files=> files.id === fileId)
    )
    res.json({...directoryData,files});

  }
  else
  {
    const directoryData = directoriesData.find(directory => 
      directory.id === id
    );
    const files = directoryData.files.map(fileId=>
      filesData.find(files=> files.id === fileId)
    )
    res.json({...directoryData,files});
  }

})

router.post('/*',async(req,res)=>{

  const dirname = path.join('/',req.params[0]);
  try{
    await mkdir(`./storage/${dirname}`);
  }
  catch(err)
  {
    res.json({message: err.message});
  }
  
}
)

export default router;