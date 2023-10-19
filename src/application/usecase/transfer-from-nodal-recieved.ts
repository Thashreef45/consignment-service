import * as amqp from 'amqplib'
import { config } from 'dotenv'
import repository from "../../infrastructure/repositories/repository"
import decodeToken from "../../utils/decode-token"
import publisher from '../events/publisher/publisher'
config()

const sendFdmFromNodalSending = async (data: { token: string, id: string }) => {
    const NodalId: string = String(decodeToken(data.token))
    const consignmentData: any = await repository.getByObjectId(data.id)

    let cpData: any = await getCpData(consignmentData.destinationPin)
    cpData = JSON.parse(cpData)

    publisher.trasferFdmToCP({ id: cpData.id, awb: `${consignmentData.awbPrefix}${consignmentData.awb}` })

    publisher.removeFdmFromNodalRecievingQueue({ id: NodalId, awb: `${consignmentData.awbPrefix}${consignmentData.awb}` })

    const response = await repository.updateFdmRecievedAtCP
        (
            cpData.id,
            cpData.address,
            cpData.name,
            consignmentData.awbPrefix,
            consignmentData.awb,
            data.id
        )
    if(response) return {status:200,message:'success'}
    else return {status:400,message:'Db updation failed'}

}


const getCpData = (pincode: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queue = 'cp-details-to-nodal'
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

            channel.sendToQueue(queue, Buffer.from(JSON.stringify({ pin: pincode })), {
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



export default sendFdmFromNodalSending
