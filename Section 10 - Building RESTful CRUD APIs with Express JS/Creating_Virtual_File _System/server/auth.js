import usersData from "./usersDB.json" with {type:"json"};


export default function authCheck(req,res,next){
    console.log(req.cookies);
    const {uid} = req.cookies;
    const user = usersData.find(user=> user.id === uid)
    if(!uid || !user)
    {
        return res.status(401).json({error: 'Not loggedIn!!'})
    }

    req.user = user;

    next();
}