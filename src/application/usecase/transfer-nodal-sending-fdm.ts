import * as amqp from 'amqplib'
import { config } from 'dotenv'
import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"
import publisher from "../events/publisher/publisher"
config()

const transferNodalSendingFdm = async (data: { id: string, token: string }) => {
    const nodalId = String(decodeToken(data.token))
    const consignmentDetails = await repository.getByObjectId(data.id)

    if (consignmentDetails) {
        if (consignmentDetails.isSameNodal) {
            executeSameNodal(consignmentDetails)
        } else {
            executeApex(consignmentDetails)
        }
        
        removeFdmFromNodal(nodalId, consignmentDetails)
    } else {
        return { status: 404, message: 'Consignment not found' }
    }


}


export default transferNodalSendingFdm




//Fdm Transfer logics

const removeFdmFromNodal = (id: string, data: any) => {
    publisher.removeFdmFromNodal({ id: id, awb: `${data.awbPrefix}${data.awb}` })
}


// same nodal -- transfer to cp
const executeSameNodal = async (data: any) => {
    let cpData: any = await getCpDetails({ pin: data.destinationPin });
    cpData = JSON.parse(cpData)
    const statusId = String(await getStatusId())
    await repository.NodaltoCpSendPart(data._id, cpData.address, cpData.id, cpData.name,statusId)
    publisher.trasferFdmToCP({ id: cpData.id, awb: `${data.awbPrefix}${data.awb}` })
}


const executeApex = async (data: any) => {
    let cpData:any = await getCpDetails({ pin: data.originPin })
    cpData = JSON.parse(cpData)
    
    let apexData: any = await getApexDetails({ prefix: cpData.prefix })
    apexData = JSON.parse(apexData)
    await repository.NodalToApexSendPart(data._id, apexData.address, apexData.id, apexData.name)
    publisher.transferFdmToApex({ id: apexData.id, awb: `${data.awbPrefix}${data.awb}` })
}






//getting cp data to set on the consignment, when fdm transfering to cp from nodal
const getCpDetails = (data: { pin: number }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queue = 'get-cp-details';
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

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
                correlationId: correlationId,
                replyTo: reply.queue,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};




const getApexDetails = (data: { prefix: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queue = 'get-apex-details-by-prefix'
            const Url = String(process.env.RabbitMQ_Link);
            const correlationId = generateUuid();

            const connection = await amqp.connect(Url);
            const channel = await connection.createChannel();
            const reply = await channel.assertQueue('', { exclusive: true });
            await channel.assertQueue(queue);

            channel.consume(reply.queue, (msg) => {
                if (msg) {
                    if (msg.properties.correlationId === correlationId) {
                        const apexData = msg.content.toString();
                        try {
                            resolve(apexData);
                        } catch (error) {
                            console.error('Error parsing JSON response:', error);
                            resolve(null)
                        }
                    }
                }
            }, { noAck: true });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
                correlationId: correlationId,
                replyTo: reply.queue,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

//status id of out for delivery
const getStatusId = async () => {
    const data = await repository.getAllDeliveryStatus()
    let index = 0
    
    return data.map((status,i)=>{
        if(status.statusName == 'Out for delivery') {
            index = i
            return String(status._id)
        }
    })[index]
}






const generateUuid = () => {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
};
