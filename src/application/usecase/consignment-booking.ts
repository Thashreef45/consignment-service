import { verify } from "jsonwebtoken"
import repository from "../../infrastructure/repositories/repository"
import publisher from "../events/publisher/publisher"

const newConsignment = async (data: any) => {
    try {

        data.awbPrefix = data.awb.slice(0, 2)
        data.awb = Number(data.awb.slice(2, 10))
        data.mobile = Number(data.mobile)
        data.id = tokenExtract(data.token)
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


const tokenExtract = (token:string) => {
    const jwtSignature = String(process.env.JWT_SIGNATURE)
    token = token.split(" ")[1]
    const data = verify(token,jwtSignature)
    if(typeof data == 'object'){
        return data.id
    }
}