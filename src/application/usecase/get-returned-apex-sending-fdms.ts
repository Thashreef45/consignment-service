import decodeToken from "../../utils/decode-token"
import repository from "../../infrastructure/repositories/repository"


const getApexSendingReturnedFdms = async (token: string) => {
    try {
        const apexId: string = String(decodeToken(token))
        const data = await repository.getApexReturnedSendingFdms(apexId)
        return {status:200,message:'success',data}
    } catch (error) {
        return {status:400,message:'Failed to fetch data'}
    }
}

export default getApexSendingReturnedFdms