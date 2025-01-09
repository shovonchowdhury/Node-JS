import express from "express";

import { mkdir, readdir, rename, rm, stat, writeFile } from "fs/promises";
import directoriesData from "../directoriesDB.json" with {type:"json"};
import usersData from "../usersDB.json" with {type:"json"};


const router = express.Router();

router.post('/',async(req,res,next)=>{
    const {name,email,password} = req.body;
    // console.log(req.body)
    const userExited = usersData.find(user=> user.email === email);
    if(userExited)
    {
        return res.status(409).json({
            error: "User already exists",
            message: "A user with this email address already exists. Please try logging in or use a different email."
          })
    }
    const userId = crypto.randomUUID();
    const rootDirId = crypto.randomUUID();

    usersData.push({
        id : userId,
        name,
        email,
        password,
        rootDirId
    })

    directoriesData.push({
        id: rootDirId,
        name: `root-${email}`,
        userId,
        parentDirId:null,
        files:[],
        directories:[]
    })

    try
    {
        await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
        await writeFile('./usersDB.json',JSON.stringify(usersData));

        return res.status(201).json({message: "User Registered"});
    }
    catch(err){
        next(err);
    }


})


export default router;