import decodeToken from "../../utils/decode-token"
import repository from "../../infrastructure/repositories/repository"


const getNodalReturnSendingFdms = async (token: string) => {
    try {
        const id: string = String(decodeToken(token))
        const response = await repository.getNodalReturnedSendingFdms(id)
        return {status:200,message:'success',data:response}
    } catch (error) {
        return {status:400,message:'Failed to fetch data'}
    }
}

export default getNodalReturnSendingFdms