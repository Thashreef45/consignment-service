interface GrpcCallBack {
    (error: Error | null, response: any): void
}

interface BuyAwbCall {
    request: {
        quantity: number;
        awbPrefix: string;
        id: string;
    }
}

interface NewBooking {
    request: {
        awb: string;
        image: string;
        mobile: number
        address: string
        pincode: number
        originPin: number
        isDoc: boolean
        contentType: string
        declaredValue: number;
        cpId: string;
    }
}


export {
    GrpcCallBack,
    BuyAwbCall,
    NewBooking
}