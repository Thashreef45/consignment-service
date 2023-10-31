import { verify } from "jsonwebtoken"
import repository from "../../infrastructure/repositories/repository"

const getNodalSendFdms = async(token:string) => {
    try {
        const id:string = String(tokenExtract(token))
        const response = await repository.getNodalSendFdms(id)
        if(response.length){
            return {status:200,data:response}
        }else{
            return {status:400,message:'No data found'}
        }
    } catch (error) {
        
    }
}



export default getNodalSendFdms



const tokenExtract = (token:string) => {
    const jwtSignature = String(process.env.JWT_SIGNATURE)
    token = token.split(" ")[1]
    const data = verify(token,jwtSignature)
    if(typeof data == 'object'){
        return data.id
    }
}