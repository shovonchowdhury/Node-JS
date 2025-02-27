import { ObjectId } from "mongodb";

export default function filterInvalidID(req,res,next,id){
    
    if(!ObjectId.isValid(id))
    {
      return res.status(400).json({error: `Invalid Id : ${id}`});
    }

    next();
}