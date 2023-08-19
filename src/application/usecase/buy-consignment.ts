import repository from "../../infrastructure/repositories/repository";
import publisher from "../events/publisher";
import { AwbOrder } from "../interfaces/interface";


//function to get last updated awb and publish the data to cp-service
const purchaseAwb = async (data: AwbOrder) => {
    let updated = await repository.buyConsignment(data.awbPrefix, data.quantity)
    let lastUpdatedAwb = await repository.lastUpdatedAwb(data.awbPrefix)
    if (updated) {
        if (lastUpdatedAwb) {
            data.awbAvailability = lastUpdatedAwb.awbAvailability
        }
        updateAwbStore(data)
        publisher.purchasedConsignment(data)
        return {message:'success',status:200}
    }
}

//function to update awb-store
const updateAwbStore = (data:AwbOrder) =>{
    const updateData = {
        cpId : data.id,
        prefix : data.awbPrefix,
        awbFrom : data.awbAvailability + 1,
        awbTo : data.quantity +  data.awbAvailability + 1,
    }
    repository.awbNewOrder(updateData)
}


export default purchaseAwb