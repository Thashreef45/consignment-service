import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import controller from '../controller/controller'

const packageDef = protoLoader.loadSync("./src/interfaces/grpc-config/consignment.proto",{})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const consignmentPackage: any = grpcObject.consignmentPackage;

const server = new grpc.Server()

const grpcServer = () => {
    server.bindAsync(String(process.env.GATE_WAY_PORT),
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (!err) {
                server.start()
                console.log("gRPC server started on port:", port)
            }
        }
    )
}

server.addService(consignmentPackage.consignmentService.service,{
    "buyAwb":controller.PurchaseAwb
})

export default grpcServer