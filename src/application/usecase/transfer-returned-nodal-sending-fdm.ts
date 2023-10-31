import * as amqp from 'amqplib'
import { config } from 'dotenv'
import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"



const transferNodalSendingReturnedFdm = async (data:{token:string,id:string}) => {

    const nodalId:string = String(decodeToken(data.token))
    const consignment = await repository.getByObjectId(data.id)
    if(consignment){
        if(!consignment.isReturned){
            return {status:400,message:'Cannot return this consignment'}
        }
        else if(consignment.isSameNodal){
            executeSameNodal(consignment)
        }else if(consignment.isSameApex){
            executeSameApex()
        }else {
            executeApex()
        }
    }else{
        return {status:404,message:'Consignment not found'}
    }

}

export default transferNodalSendingReturnedFdm


const executeSameNodal = async (data:any) => {
    let cpData:any = await getCpDetails({ pin: data.originPin })
    cpData = JSON.parse(cpData)
    if(!cpData){
        return {status:404,message:'Failed to find CP details'}
    }
    let updated = await repository.transferReturnFromNodalSendingToCpRecieving(data._id,cpData.address,cpData.name,cpData.id)
    if(updated){
        return {status:200,message:'success'}
    }else{
        return {status:400,message:'Failed to transfer'}
    }
}

const executeSameApex = () => {}
const executeApex = () => {}




const getCpDetails = (data: { pin: number }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queue = 'get-cp-details'
            const Url = String(process.env.RabbitMQ_Link);
            const correlationId = generateUuid();

            const connection = await amqp.connect(Url);
            const channel = await connection.createChannel();
            const reply = await channel.assertQueue('', { exclusive: true });
            await channel.assertQueue(queue);

            channel.consume(reply.queue, (msg) => {
                if (msg) {
                    if (msg.properties.correlationId === correlationId) {
                        const cpData = msg.content.toString();
                        try {
                            resolve(cpData);
                        } catch (error) {
                            console.error('Error parsing JSON response:', error);
                            resolve(null)
                        }
                    }
                }
            }, { noAck: true });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify({ pin: data.pin })), {
                correlationId: correlationId,
                replyTo: reply.queue,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }

    });

}


const generateUuid = () => {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
};
