import repository from "../../infrastructure/repositories/repository"


const newConsignment = (data:{}) => {
    repository.newBooking(data)
}

export default newConsignment