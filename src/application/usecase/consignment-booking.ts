import { verify } from "jsonwebtoken"
import repository from "../../infrastructure/repositories/repository"
import publisher from "../events/publisher/publisher"
import decodeToken from "../../utils/decode-token"

const newConsignment = async (data: any) => {
    try {

        data.awbPrefix = data.awb.slice(0, 2)
        data.awb = Number(data.awb.slice(2, 10))
        data.mobile = Number(data.mobile)
        data.id = decodeToken(data.token)
        const statusId = await getBookedStatusId()
        data.statusId = statusId


        const updated = await repository.newBooking(data)
        if (updated) {
            publisher.removeBookedAwb({
                cpId:data.id,
                awbPrefix:data.awbPrefix,
                awb:data.awb
            })
            return {
                message: 'Booking Success',status: 201
            }
        }
        else {
            console.log(updated,'500')
            return {message: 'Booking Failed',status: 500}
        }
        

    } catch (error) {
        console.log(error)
    }
}

export default newConsignment

const getBookedStatusId = async () => {
    const data = await repository.getAllDeliveryStatus()
    let index = 0
    
    return data.map((status,i)=>{
        if(status.statusName == 'Booked') {
            index = i
            return String(status._id)
        }
    })[index]
}

