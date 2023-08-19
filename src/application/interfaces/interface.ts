// export interface BuyConsignment {
//     [key: string]: number,
// }

// export interface BuyAwb {
//     quantity: number,
//     awbPrefix: string,
//     id: string,
// }
export interface CreateAwb {
    prefix: string,
    type: string,
}

export interface AwbOrder {
    quantity: number,
    awbPrefix: string,
    id: string,
    awbAvailability: number
}




