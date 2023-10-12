import repository from "../../infrastructure/repositories/repository"

const ConsignmentTypes = async() => {
    const data = await repository.getTypes()
    if(data){
        return {status:200,types:data}
    }else{
        return {status:404}
    }
}

export default ConsignmentTypes