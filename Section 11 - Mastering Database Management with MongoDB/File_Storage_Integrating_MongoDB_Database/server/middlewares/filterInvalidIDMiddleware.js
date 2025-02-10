export default function filterInvalidID(req,res,next,id){
    const uuidRegex = /^[a-fA-F0-9]{24}$/;
    
    if(!uuidRegex.test(id))
    {
      return res.status(400).json({error: `Invalid Id : ${id}`});
    }

    next();
}