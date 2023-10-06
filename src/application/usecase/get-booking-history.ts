import repository from "../../infrastructure/repositories/repository";

const getBookingHistory = async (data: any) => {
    try {
        data.from = new Date(data.from)
        data.to = new Date(data.to)
        const consignment = await repository.getBookingHistory(data)
        console.log(consignment,'--data')
        return {status:200,data:consignment}
    } catch (error) {
        return {status:404,message:'Data not found'}
    }
}

export default getBookingHistory

