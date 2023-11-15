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
    const fdm = data.data
    for (let i = 0; i < fdm.length; i++) {
        const prefix = fdm[i].slice(0, 2)
        const awb = Number(fdm[i].slice(2, fdm[i].length))
        UpdateConsignments(data.id,prefix, awb,data.address,data.name)
    }

}


const UpdateConsignments = async (id:string,prefix: string, awb: number,address:string,name:string) => {
    const statusId = String(await setStatus())
    await repository.BookingsReachedAtNodal(id,prefix, awb,address,name,statusId)
}



const setStatus = async () => {
    const data = await repository.getAllDeliveryStatus()
    let index = 0
    
    return data.map((status,i)=>{
        if(status.statusName == 'Intransist') {
            index = i
            return String(status._id)
        }
    })[index]
}


export default fdmReachedNodalAfterBooking

