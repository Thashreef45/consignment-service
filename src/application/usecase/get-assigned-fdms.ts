import mongoose from "mongoose";
import repository from "../../infrastructure/repositories/repository"

const getAssignedFdms = async (id: string) => {
    try {
        const objid = setObjectId(id)
        const response = await repository.getEmployeeAssignedFdms(objid)
        return { status: 200, data: response }
    } catch (error) {
        return { status: 404, message: 'Unable to find data' }
    }
}




const setObjectId = (empId: string): mongoose.Types.ObjectId => {
    const ObjectId = mongoose.Types.ObjectId;
    const idObject = new ObjectId(empId);
    return idObject
}

export default getAssignedFdms