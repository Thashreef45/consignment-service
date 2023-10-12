import repository from "../../infrastructure/repositories/repository"

const createContent = (data:string) =>{
   return repository.createNewConsignmentType(data)
}

export default createContent