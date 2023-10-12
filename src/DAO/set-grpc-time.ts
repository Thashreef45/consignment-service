
const setGrpcTime = (data:any) => {
    data.forEach((element:any )=> {
        element.bookingTime = String(element.bookingTime)
    })
    return data
}


export default setGrpcTime