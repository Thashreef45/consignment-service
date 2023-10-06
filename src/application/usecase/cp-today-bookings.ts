import setGrpcTime from "../../DAO/set-grpc-time"
import repository from "../../infrastructure/repositories/repository"

const todaysBooking = async (pincode: number) => {
    try {
        const data = await repository.getTodaysBookings(pincode)
        const bookings = setGrpcTime(data)
        return { bookings, message: 'success', status: 200 }
    } catch (error) {
        return { message: 'Data fetching failed', status: 400 }
    }
}







export default todaysBooking