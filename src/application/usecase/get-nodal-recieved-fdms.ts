import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"

const NodalRecievedFdms = async (token:string) => {
    const id:string = String(decodeToken(token))
    const response = await repository.getNodalRecievedFdms(id)
    if(response){
        return {status:200,data:response}
    }else return {status:404,message:'Data not found'}
}

export default NodalRecievedFdms