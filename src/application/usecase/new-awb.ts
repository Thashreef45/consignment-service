import repository from "../../infrastructure/repositories/repository"
import { CreateAwb } from "../../domain/interface/awb"

const createAwb = (data:CreateAwb) =>{
    let obj = {
        prefix:data.prefix,
        type:data.type,
    }
    
    repository.createAwb(obj)
}

export default createAwb
