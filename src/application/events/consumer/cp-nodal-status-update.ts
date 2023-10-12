import * as amqp from 'amqplib'
import { config } from 'dotenv'
import repository from '../../../infrastructure/repositories/repository'
config()


const Url = String(process.env.RabbitMQ_Link)
const queue = 'update-consignment-after-reaching-nodal'

const fdmReachedNodalAfterBooking = async () => {
    try {
        const connection = await amqp.connect(Url)
        const channel = await connection.createChannel()
        await channel.assertQueue(queue)

        channel.consume(queue, (data: any) => {
            channel.ack(data)
            execute(data.content.toString())
        })

    } catch (error) {
        console.log(error)
    }
}

const execute = async (data: any) => {
    data = JSON.parse(data)
    console.log(data)

    for (let i = 0; i < data.length; i++) {
        const prefix = data[i].slice(0, 2)
        const awb = Number(data[i].slice(2, data[i].length))
        UpdateConsignments(prefix, awb)
    }

}


const UpdateConsignments = async (prefix: string, awb: number) => {
    await repository.BookingsReachedAtNodal(prefix, awb)
}


export default fdmReachedNodalAfterBooking

