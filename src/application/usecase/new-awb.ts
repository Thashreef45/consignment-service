import repository from "../../infrastructure/repositories/repository"
import { CreateAwb } from "../interfaces/interface" 

const createAwb = async (data: CreateAwb) => {
    let awbAlreadyExist = await repository.isExist({prefix:data.prefix})
    if (!awbAlreadyExist.length) {
        let obj = {
            prefix: data.prefix,
            type: data.type,
        }
        let res = await repository.createAwb(obj)
        return { message: 'success', data }
    }else {
        return {message:'Awb prefix is already exist'}
    }

}

export default createAwb

