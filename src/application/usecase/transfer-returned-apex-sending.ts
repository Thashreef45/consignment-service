import repository from "../../infrastructure/repositories/repository"


const transferApexSendingReturnFDM = async (data: { id: string }) => {
    const consignment = await repository.getByObjectId(data.id)
    if (consignment) {
        if (!consignment.isReturned) {
            return { status: 400, message: 'Cannot return this consignment' }
        } else if (consignment.isSameApex) {
            return executeSameApex(consignment)
        } else {
            return executeApexToApex(consignment)
        }
    } else {
        return { status: 404, message: 'Consignment not found' }
    }
}

export default transferApexSendingReturnFDM


//from apex sending to nodal recieving
const executeSameApex = async (data: any) => {
    try {
        await repository.transferReturnFromApexSendingToNodalRecieving(
            data._id, data.sending.nodalRecieved.name,
            data.sending.nodalRecieved.address,
            data.sending.nodalRecieved.id,
        )
        return { status: 200, message: 'success' }
    } catch (error) {
        return { status: 400, message: 'Failed to transfer' }
    }
}

//sending from apex to apex
const executeApexToApex = async (data: any) => {
    try {
        await repository.transferReturnFromApexSendingToApexRecieving(
            data._id, data.sending.apexRecieved.name,
            data.sending.apexRecieved.address,
            data.sending.apexRecieved.id,
        )
        return { status: 200, message: 'success' }
    } catch (error) {
        return { status: 400, message: 'Failed to transfer' }
    }
}