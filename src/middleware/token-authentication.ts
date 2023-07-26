import { Request,Response,NextFunction } from "express"
import { verify } from "jsonwebtoken"

const tokenCheck = (req:Request ,res:Response,next:NextFunction) =>{
    const {key} = req.headers
    if(key){
        let token: string;
        if (Array.isArray(key)) {
          token = key[0].split(" ")[1];
        } else {
          token = key.split(" ")[1];
        }
        if(verify(token,String(process.env.JWT_SIGNATURE)))next()
        else res.status(401).json({message:"invalid-token"})
    }else{
        res.status(401).json({message:"required jwt-token"})
    } 
}

export default tokenCheck