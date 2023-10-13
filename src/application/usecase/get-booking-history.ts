import convertStringToTime from "../../DAO/string-to-time";
import repository from "../../infrastructure/repositories/repository";

const getBookingHistory = async (data: any) => {
    try {
        data.from = convertStringToTime(data.from)

        let day = Number(data.to[9])
        data.to = data.to.slice(0,9) + String(day + 1)
        data.to = convertStringToTime(data.to)
        

        const consignment = await repository.getBookingHistory(data)
        return {status:200,data:consignment}

    } catch (error) {
        return {status:404,message:'Data not found'}
    }
}

export default getBookingHistory

