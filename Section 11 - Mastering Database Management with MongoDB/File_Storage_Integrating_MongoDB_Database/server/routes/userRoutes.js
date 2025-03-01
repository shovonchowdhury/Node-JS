import express from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { Db, ObjectId } from "mongodb";




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

    const 


    try
    {
        // await writeFile('./directoriesDB.json',JSON.stringify(directoriesData));
        // await writeFile('./usersDB.json',JSON.stringify(usersData));
        const userId = new ObjectId();
        const rootDirId = new ObjectId();

        const userCollection = db.collection("users");

        await userCollection.insertOne({
            _id: userId,
            name,
            email,
            password,
            rootDirId,
        })
    
        //const userId = createdUser.insertedId;
    
    
        // console.log(userId);
    
         await db.collection("directories").insertOne({
            _id : rootDirId,
            name: `root-${email}`,
            userId,
            parentDirId:null,
        })
    
        return res.status(201).json({message: "User Registered"});
    }
    catch(err){

        if(err.code === 121)
        {
            return res.status(400).json({error: 'Invalid input! please input valid details.'})
        }
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