import express from "express";

import { mkdir, readdir, rename, rm, stat } from "fs/promises";
import path from "path";


const router = express.Router();

router.get('/?*',async(req,res)=>{

  const dirname = path.join('/',req.params[0]);
  console.log(dirname);
  const fullDirPath = `./storage/${dirname ? dirname : ''}`
  const fileList = await readdir(fullDirPath);
  console.log(fullDirPath);
  const resData=[];
  for(const item of fileList)
  {
    const stats= await stat(`${fullDirPath}/${item}`);
    resData.push({name:item, isDirectory: stats.isDirectory()});
    console.log('hello')
  }
  console.log(resData);
  res.json(resData);
}
)


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