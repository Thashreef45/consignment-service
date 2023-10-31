import decodeToken from "../../utils/decode-token"
import repository from "../../infrastructure/repositories/repository"


const getApexRecievedFdms  = async(token:string) => {
    const apexId:string = String( decodeToken(token))
    const data = await repository.getApexRecievedFdms(apexId)
    if(data){
        return {status:200,message:'success',data}
    }
    return {status:404,message:'Failed to fetch data'}
}


export default getApexRecievedFdms