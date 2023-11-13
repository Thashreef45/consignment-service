import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"


const getNodalReturnRecievedFdms = async (token:string) => {
    try {
        const nodalId : string = String(decodeToken(token))
        const data = await repository.getNodalReturnedRecievedFdms(nodalId)
        return {status:200 , data : data}
    } catch (error) {
        return {status : 400 , message:'Failed to fetch data'}
    }
}

export default getNodalReturnRecievedFdms