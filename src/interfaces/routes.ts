import express,{Application,Request,Response} from 'express'
import controller from './controller/controller'

const route:Application = express()

route.post('/create-consignment',controller.createConsignment)
route.post('/buy-consignment',controller.PurchaseConsignment)
route.post('/create-awb',controller.CreateAwb)

export default route