import repository from "../../infrastructure/repositories/repository"


const createDeleveryStatus = async(status:string) =>{
    return await repository.createNewDeleveryStatus(status)
}

export default createDeleveryStatus