import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"

const getReturnedApexRecievedFdms = async (token: string) => {
    try {
        const apexId: string = String(decodeToken(token))
        const data = await repository.getApexReturnedRecievedFdms(apexId)
        return {status:200,data:data}
    } catch (error) {
        return {status:400,message:'Failed to fetch data'}
    }
}


export default getReturnedApexRecievedFdms