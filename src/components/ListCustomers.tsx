import { useQuery } from "@tanstack/react-query"
import { getCustomerList } from "../Api"

const ListCustomers = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["getCustomerList"],
        queryFn: () => getCustomerList()
    })

    if (isLoading) {
        return <div>Loading......</div>
    }

    const customerDetails = data?.map(({ id, name, budget, location, specification, phonenumber }) =>
    (<li key={id}>
        ID {id} ,
        name {name},
        Budget : {budget},
        Location : {location},
        Specification: {specification}, Phone Number : {phonenumber}</li>))

    return (
        <>
            <div>ListCustomers</div>
            <div>{customerDetails}</div>
        </>

    )
}

export default ListCustomers