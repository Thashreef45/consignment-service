import { Request,Response,NextFunction } from "express"
import { verify ,JwtPayload} from "jsonwebtoken"

const cpCheck = (req:Request ,res:Response,next:NextFunction) =>{
    const {key} = req.headers
    if(key){
        let token: string;
        if (Array.isArray(key)) {
          token = key[0].split(" ")[1];
        } else {
          token = key.split(" ")[1];
        }
        const data = verify(token,String(process.env.JWT_SIGNATURE)) as JwtPayload
        if(data && data.administration == 'channelPartner')next()
        else res.status(401).json({message:"Unauthorized"})
    }else{
        res.status(401).json({message:"required jwt-token"})
    } 
}

export default cpCheck