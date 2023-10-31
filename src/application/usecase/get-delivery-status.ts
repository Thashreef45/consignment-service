import repository from "../../infrastructure/repositories/repository"


const getDeliveryStatus = async() => {
    try {
        const response = await repository.getDeliveryStatus()
        return {status:200,data:response}
    } catch (error) {
        return {status:200,message:'Data fecthing failed'}
    }
}

export default getDeliveryStatus