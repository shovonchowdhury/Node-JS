import { ObjectId } from "mongodb";
import usersData from "../usersDB.json" with {type:"json"};


export default async function authCheck(req,res,next){
    // console.log(req.cookies);
    console.log(req.cookies);
    const {uid} = req.cookies;
    console.log(uid);
    const db = req.db;
    if(!uid)
    {
        return res.status(401).json({error: 'Not loggedIn!!'})
    }
    const user = await db.collection("users").findOne({_id : new ObjectId(String(uid))})
    if(!user)
    {
        return res.status(401).json({error: 'Not loggedIn!!'})
    }

    req.user = user;

    next();
}