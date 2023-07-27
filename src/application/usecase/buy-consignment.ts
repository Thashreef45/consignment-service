import { verify , JwtPayload} from "jsonwebtoken";
import repository from "../../infrastructure/repositories/repository";
import publisher from "../events/publisher";
import { BuyConsignment } from "../../domain/interface/awb";


const purchaseConsignment = async(data:any,token:string) => {
    try {
        data = data.data
        let cpId = verifyToken(token) as JwtPayload
        let count = Object.keys(data[0]) 
        let obj:BuyConsignment = {}

        if(count.length == 1){
            repository.buyConsignment(count[0] , data[count[0]])
            obj[count[0]] = 1

            let updateData = await repository.availablityCheck(obj)
            publisher.purchasedConsignment({
                consignment : updateData,
                count :  [data[count[0]]],
                cpId : cpId.id,
            })
        }
        else if(count.length == 2){
            repository.buyConsignment(count[0],data[0][count[0]])
            repository.buyConsignment(count[1],data[0][count[1]])
  
            obj[count[0]] = 1
            obj[count[1]] = 1
            
            let updateData = await repository.availablityCheck(obj)
            publisher.purchasedConsignment({
                consignment : updateData,
                count :  [data[count[0]],data[count[1]]],
                cpId : cpId.id,
            })
        }
        else{
            repository.buyConsignment(count[0],data[0][count[0]])
            repository.buyConsignment(count[1],data[0][count[1]])
            repository.buyConsignment(count[2],data[0][count[2]])
            obj[count[0]] = 1
            obj[count[1]] = 1
            obj[count[2]] = 1
            let updateData = await repository.availablityCheck(obj)
            publisher.purchasedConsignment({
                consignment : updateData,
                count :  [data[count[0]],data[count[1]], data[count[2]]],
                cpId : cpId.id,
            })
        }
    } catch (error) {
        console.log(error);
        
    }
}

const verifyToken=(key:string) => {
    return verify(key,String(process.env.JWT_SIGNATURE))
}

export default purchaseConsignment