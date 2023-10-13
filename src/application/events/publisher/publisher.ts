import * as amqp from 'amqplib'
import { config } from 'dotenv'
config()


const publisher = async (queue: string, data: {}) => {
    try {
        const Url = String(process.env.RabbitMQ_Link)
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
    purchasedConsignment: async (data: any) => {
        try {
            const queue = 'buy-awb'
            publisher(queue, data)
        } catch (error) {
            console.log(error)
        }
    },


    //removing available consignment number from channel partner after booking
    removeBookedAwb: async (data: any) => {
        try {
            const queue = 'remove-awb'
            publisher(queue, data)
        } catch (error) {
            console.log(error)
        }
    },

    //resetting awb after deleting a recently booked consignment
    setAwbToCp: async (data: any) => {
        try {
            const queue = 'reset-awb'
            publisher(queue, data)
        } catch (error) {
            console.error(error)
        }
    },


    //While transfering fdm from nodal sending queue , it should be removed from the queue
    removeFdmFromNodal : async(data:any) => {
        try {
            const queue = 'remove-sending-fdm'
            publisher(queue, data)
        } catch (error) {
            console.error(error)
        }
    },

    //Trasfering fdm to cp receiving queue
    trasferFdmToCP : async(data:any) => {
        try {
            const queue = 'transfer-fdm-cp-receiving'
            publisher(queue, data)
        } catch (error) {
            console.error(error)
        }
    },
    
}