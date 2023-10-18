import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"

const getApexSendingFdms = async(token:string) =>{
    const id:string = String(decodeToken(token))
    const response = await repository.getApexSendingFdms(id)
    if(response){
        return {status:200,data:response}
    }else{
        return {status:400,message:'Consignment Data fetching failed'}
    }
}

export default getApexSendingFdms
