import decodeToken from "../../utils/decode-token"
import repository from "../../infrastructure/repositories/repository"
import publisher from "../events/publisher/publisher"


const deleteBooking = async (data: any) => {
    try {
        const cpId = decodeToken(data.token)

        const awbData = await repository.getAwb(data.id)
        //assign awb to cp back after deleting a booking
        if (awbData) {
            publisher.setAwbToCp({
                prefix: awbData.awbPrefix,
                awb: awbData.awb,
                id: cpId
            })
        }
        //delete consignment
        let isDeleted = await repository.deleteBooking(data.id)
        if(isDeleted) {
            return {status:200,message:'Successfully deleted'}
        }
    } catch (error) {
        return {status:400,message:'Delete Failed'}
    }
}

export default deleteBooking