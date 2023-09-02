import repository from "../../infrastructure/repositories/repository"
import publisher from "../events/publisher"

const newConsignment = async (data: any) => {
    try {

        data.awbPrefix = data.awb.slice(0, 2)
        data.awb = Number(data.awb.slice(2, 10))
        data.mobile = Number(data.mobile)
        const updated = await repository.newBooking(data)

        if (updated) {
            publisher.removeBookedAwb({
                cpId:data.cpId,
                awbPrefix:data.awbPrefix,
                awb:data.awb
            })
            return {
                message: 'Booking Success',status: 201
            }
        }
        else return {
            message: 'Booking Failed',status: 500
        }

    } catch (error) {
        console.log(error)
    }
}

export default newConsignment