// export interface BuyConsignment {
//     [key: string]: number,
// }

// export interface BuyAwb {
//     quantity: number,
//     awbPrefix: string,
//     id: string,
// }
interface CreateAwb {
    prefix: string,
    type: string,
}

interface BuyAwb {
    quantity: number,
    awbPrefix: string,
    id: string,
}

interface AwbOrder {
    quantity: number,
    awbPrefix: string,
    id: string,
    awbAvailability: number
}

export {
    AwbOrder,CreateAwb,
    BuyAwb,
}




