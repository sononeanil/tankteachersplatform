import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { getAllPost } from "../Api"

const Tanstack = () => {

    const { data, isLoading } = useQuery({
        queryFn: () => getAllPost(),
        queryKey: ["getAllPost"]
    });

    if (isLoading) {
        return <div>....Loading</div>
    }

    return (
        <div>Tanstack
            <div>
                <h1><Link to="/home">home</Link></h1>
            </div>
            <ul>
                {data?.map(({ id, title }) => (<li key={id}>{id} {title}</li>))}
            </ul>
        </div>
    )
}

export default Tanstack