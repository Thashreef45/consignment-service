import repository from "../../infrastructure/repositories/repository"


const assignFdmToEmployee = async (data: { token: string, id: string, empId: string }) => {
    try {
        const consignment = await repository.getByObjectId(data.id)
        if(!consignment?.isReturned){
            return executeFdm(data.id,data.empId)
        }else{
            return executeRTOFdm(data.id,data.empId)
        }
    } catch (error) {
        return {status:400,message:'failed to update'}
    }
}


const executeFdm = async(id:string,empId:string) => {
    await repository.assignFdmtoEmployee(id,empId)
    return {status:200,message:'success'}
}

const executeRTOFdm = async(id:string,empId:string) => {
    await repository.assignRTOFdmtoEmployee(id,empId)
    return {status:200,message:'success'}
}


export default assignFdmToEmployee