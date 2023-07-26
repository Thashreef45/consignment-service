
import * as amqp from 'amqplib'


const publisher = async (queue:string, data:{}) => {
    try {
        const Url = 'amqp://localhost:5672'
        const connection = await amqp.connect(Url)
        const channel = await connection.createChannel()
        await channel.assertQueue(queue)
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
        await channel.close()
        await connection.close()
    } catch (error) {
        console.log(error)
    }
}


export default {
    //sending purchased consignments to cp
    purchasedConsignment: async (data:{}) => {
        try {
            const queue = 'add-consignments'
            publisher(queue, data)
        } catch (error) {
            console.log(error)
        }
    },

}