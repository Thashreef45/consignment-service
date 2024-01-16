import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import controller from '../controller/controller'

const packageDef = protoLoader.loadSync("./src/interfaces/grpc-config/consignment.proto")
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
    "buyAwb":controller.PurchaseAwb,
    "newBooking":controller.newBooking,
    "getConsignmentTypes" : controller.getConsignmentTypes,
    "getTodaysBookings":controller.getTodaysBookings,
    "deleteBooking":controller.deleteBooking,
    "getBookingHistory":controller.getBookingHistory,
    "tracking":controller.consignmentTracking,
    "getNodalSendingFdms":controller.getNodalSendFdms,
    "transferNodalSendingFdm":controller.transferNodalSendingFdm,
    "getCpRecievedFdms":controller.getCpRecievedFdms,
    "getApexSendingFdms":controller.getApexSendingFdm,
    "transferApexSendingFdm":controller.sendApexSendingFdm,
    "getNodalRecievedFdms":controller.getNodalRecievedFdms,
    "transferNodalRecievedFdm":controller.transferFdmfromNodalRecieved,
    "getApexRecievedfdms":controller.getApexRecievedFdms,
    "transferApexRecievedFdms":controller.transferFdmFromApexRecieved,
    "assignFdm":controller.assignFdmtoEmployee,
    "getAssignedFdms":controller.getEmployeeAssignedConsignments,
    "getDeliveryStatus":controller.getDeliveryStatus,
    "updateDeliveryStatus":controller.updateDeliveryStatus,
    "getReturnNodalSendingFdms":controller.getNodalSendingReturnFdms,
    "transferReturnNodalSendingFdms":controller.transferNodalSendingReturned,
    "getReturnApexSendingFdms":controller.getApexSendingReturnFdms,
    "transferReturnApexSendingFdm":controller.transferApexSendingReturned,
    "getReturnNodalRecievingFdms":controller.getNodalRecievedReturnFdms,
    "transferReturnNodalRecievedFdm":controller.transferNodalReturnRecievedFdm,
    "getReturnApexRecievedFdms":controller.getApexRecievedReturnFdms,
    "transferReturnApexRecievedFdm":controller.transferApexReturnRecieved,

})
// BookingsReachedAtNodal

export default grpcServer