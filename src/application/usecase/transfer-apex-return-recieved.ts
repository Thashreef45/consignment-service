import repository from "../../infrastructure/repositories/repository"

const transferApexReturnRecievedFdms = async (data: { token: string, id: string }) => {
    try {
        const consignment = await repository.getByObjectId(data.id)
        if (!consignment) {
            return { status : 404, message: 'Consignment not found' }
        }
        await repository.transferReturnApexRecievingToNodalRecieving(
            data.id,
            String(consignment.sending?.nodalRecieved?.address),
            String(consignment.sending?.nodalRecieved?.name),
            String(consignment.sending?.nodalRecieved?.id)
        )
        return { status: 200, message: 'success' }
    } catch (error) {
        return { status: 400, message: 'failed to transfer' }
    }
}

export default transferApexReturnRecievedFdms