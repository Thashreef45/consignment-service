import repository from "../../infrastructure/repositories/repository"

const trackConsignment = async(awb:string) => {

    const awbPrefix = awb.slice(0,2)
    const awbNumber = awb.slice(2,awb.length)

    const prefixExist = await repository.isValidPrefix(awbPrefix)
    if(prefixExist){
        const data = await repository.Track(awbPrefix,awbNumber)
        if(data.length){
            return {status:200,data:data[0]}
        }else{
            return {status:404,message:'No data found'}
        }
    }else{
        return {status:400,message:'AWB Prefix is not valid'}
    }

}

export default trackConsignment


