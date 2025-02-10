import express from "express";

import { mkdir, readdir, rename, rm, stat, writeFile } from "fs/promises";
import directoriesData from "../directoriesDB.json" with {type:"json"};
import usersData from "../usersDB.json" with {type:"json"};
import authCheck from "../middlewares/authMiddleware.js";
import { Db } from "mongodb";



const router = express.Router();

router.post('/register',async(req,res,next)=>{
    const {name,email,password} = req.body;
    const db = req.db;

    const userExisted = await db.collection("users").findOne({email});
   
    if(userExisted)
    {
        return res.status(409).json({
            error: "User already exists",
            message: "A user with this email address already exists. Please try logging in or use a different email."
          })
    }
    // const userId = crypto.randomUUID();
    // const rootDirId = crypto.randomUUID();


    try
    {
        // await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
        // await writeFile('./usersDB.json',JSON.stringify(usersData));

        const userCollection = db.collection("users");

        const createdUser = await userCollection.insertOne({
            name,
            email,
            password,
        })
    
        const userId = createdUser.insertedId;
    
    
        // console.log(userId);
    
        const userRootDir = await db.collection("directories").insertOne({
            name: `root-${email}`,
            userId,
            parentDirId:null,
        })
    
        const rootDirId = userRootDir.insertedId;
    
        await userCollection.updateOne({_id : userId},{$set:{rootDirId}});

        return res.status(201).json({message: "User Registered"});
    }
    catch(err){
        next(err);
    }


})

router.post('/login',async(req,res,next)=>{
    const {email,password} = req.body;
    const db = req.db;

    const user = await db.collection("users").findOne({email,password});
    console.log(user);
   
    if(!user)
    {
        return res.status(404).json({error: 'Invalid Credentials.'});
    }

    res.cookie('uid',user._id.toString());

    res.json({message: 'logged in successfully!!'})
})

router.get('/',authCheck,(req,res)=>{
    res.status(200).json({name: req.user.name , email: req.user.email})
})

router.post('/logout', (req,res)=>{

    res.clearCookie('uid');
    res.status(204).end();
})


export default router;