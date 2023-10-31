import repository from "../../infrastructure/repositories/repository"
import publisher from "../events/publisher/publisher"



const updateDeliveryStatus = async (data: { id: string, statusId: string, image: string }) => {
    try {

        const consignment = await repository.getByObjectId(data.id)
        const status: any = await repository.getDeliveryStatusById(data.statusId)

        if (status.statusName == 'Delivered') {
            if (consignment?.isReturned) {

                return await executeRTODelivery(data)

            } else {
                const updated = await executeDelivered(data)
                if (consignment && consignment?.destinationPin) {
                    removeFdmFromCP({
                        pincode: consignment.destinationPin,
                        awb: `${consignment.awbPrefix}${consignment.awb}`
                    })
                }
                if (updated) {
                    return { status: 200, message: 'success' }
                } else {
                    return { status: 400, message: 'Delivery updation failed' }
                }
            }
        } else {
            if (consignment?.isReturned) {
                return { status: 400, message: 'Cannot return returned consignment' }
            }
            else {
                try {
                    await executeReturn(consignment, status._id, data.image)
                    return { status: 200, message: 'return updated successfully' }
                } catch (error) {
                    return { status: 400, message: 'return updation failed' }
                }
            }

        }

    } catch (error) {

    }
}


const executeRTODelivery = async(data: { id: string, statusId: string, image: string }) => {
    try {
        await repository.updateRTPDelivery(data.id, data.image)
        return {status:200,message:'success'}
    } catch (error) {
        return {status:200,message:'RTO Delivery updation failed'}
    }
}


const executeDelivered = async (data: { id: string, statusId: string, image: string }) => {
    return await repository.updateDelivered(data.id, data.statusId, data.image)
}

const executeReturn = async (consignment: any, status: string, image: string) => {
    if (consignment.isSameNodal) {
        const { address, name, id } = consignment.sending.nodalRecieved
        return await repository.updateReturnFromCpToNodal(consignment._id, status, image, address, name, id)
    }
    else {
        const { address, name, id } = consignment.recieving.nodalRecieved
        return await repository.updateReturnFromCpToNodal(consignment._id, status, image, address, name, id)
    }
}


const removeFdmFromCP = (data: { pincode: number, awb: string }) => {
    publisher.removeFdmFromCpRecievedQueue(data)
}


export default updateDeliveryStatus