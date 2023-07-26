import { verify , JwtPayload} from "jsonwebtoken";
import repository from "../../infrastructure/repositories/repository";
import publisher from "../events/publisher";

const purchaseConsignment = async(data:any,header:any) => {
    try {
        
        let cpId = verifyToken(header.key) as JwtPayload
        let count = Object.keys(data) 

        if(count.length == 1){
            repository.buyConsignment(count[0] , data[count[0]])
            let first  = count[0]
            let updateData = await repository.availablityCheck({first:1})
            publisher.purchasedConsignment({
                consignment : updateData,
                count :  [data[count[0]]],
                cpId : cpId.id,
            })
        }
        else if(count.length == 2){
            repository.buyConsignment(count[0] , data[count[0]])
            repository.buyConsignment(count[1] , data[count[1]])
            let first  = count[0]
            let second = count[1]
            let updateData = await repository.availablityCheck({first:1,second:1})
            publisher.purchasedConsignment({
                consignment : updateData,
                count :  [data[count[0]],data[count[1]]],
                cpId : cpId.id,
            })

        }
        else{
            repository.buyConsignment(count[0] , data[count[0]])
            repository.buyConsignment(count[1] , data[count[1]])
            repository.buyConsignment(count[2] , data[count[2]])
            let first  = count[0]
            let second = count[1]
            let third = count[2]
            let updateData = await repository.availablityCheck({first:1,second:1,third:1})
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