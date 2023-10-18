import * as amqp from 'amqplib'
import { config } from 'dotenv'
import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"
import publisher from '../events/publisher/publisher'
config()

const transferApexSendingFdm = async (data: { token: string, id: string }) => {

    const apexId: string = String(decodeToken(data.token))
    const consignmentData = await repository.getByObjectIdAndApexID(data.id, apexId)
    if (consignmentData) {
        if (consignmentData.isSameApex) {
            executeSameApex(apexId, consignmentData)
        } else {
            executeDifferentApex(apexId, consignmentData)
        }
    } else {
        return { status: 404, message: 'Consignment not found' }
    }

}


//for same apex next destination should be destination nodal point
const executeSameApex = async (apexId: string, data: any) => {
    const nodalData = await getNodalData(data.destinationPin)
    if (nodalData) {
        repository.updateNodalRecievedFromApex(nodalData, data._id)
        publisher.removeFdmFromApexSending({ id: apexId, awb: `${data.awbPrefix}${data.awb}` })
        publisher.sendFdmToNodalRecievingQueue({ id: nodalData.id, awb: `${data.awbPrefix}${data.awb}` })
        return { status: 200 , message:'success'}
    }
}

const executeDifferentApex = (apexId: string, data: any) => {
    // getDestinationApex()
    // updateConsignmentDB()
    // removeAwbFromCurrentApex()
    // pushAwbToNextApex()
}



const getNodalData = async (destinationPIn: number) => {
    let cpData: any = await getNodalIdFromCp(destinationPIn)
    cpData = JSON.parse(cpData)
    let nodalData: any = await getNodalDetails(cpData.nodalId)
    nodalData = JSON.parse(nodalData)
    return nodalData
}


const getNodalIdFromCp = (pincode: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queue = 'cp-details-to-apex';
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

            channel.sendToQueue(queue, Buffer.from(JSON.stringify({ pincode: pincode })), {
                correlationId: correlationId,
                replyTo: reply.queue,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

const getNodalDetails = (nodalId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queue = 'nodal-details-to-apex';
            const Url = String(process.env.RabbitMQ_Link);
            const correlationId = generateUuid();

            const connection = await amqp.connect(Url);
            const channel = await connection.createChannel();
            const reply = await channel.assertQueue('', { exclusive: true });
            await channel.assertQueue(queue);

            channel.consume(reply.queue, (msg) => {
                if (msg) {
                    if (msg.properties.correlationId === correlationId) {
                        const nodalData = msg.content.toString();
                        try {
                            resolve(nodalData);
                        } catch (error) {
                            console.error('Error parsing JSON response:', error);
                            resolve(null)
                        }
                    }
                }
            }, { noAck: true });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify({ id: nodalId })), {
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


export default transferApexSendingFdm