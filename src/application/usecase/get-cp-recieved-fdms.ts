import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"

const getCpRecievedFdms = async (token:string) => {
    try {
        const id:string  = String(decodeToken(token))
        const response = await repository.getCpRecievedFdms(id)    
        return {status:200,data:response}
    } catch (error) {
        return {status:400,message:'No Consignment for this cp'}
    }
}

export default getCpRecievedFdms