import { useMutation } from "@tanstack/react-query";
import { createMutationCustomer } from "../Api";
import { createCustomerSchema, type customer } from "../types/postType";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateCustomer = () => {

    const { mutateAsync } = useMutation({
        mutationFn: createMutationCustomer,
    })

    const createCustomer: SubmitHandler<customer> = (data) => {
        const newCustomer: customer = {
            id: 0,
            name: data.name,
            phonenumber: data.phonenumber,
            location: data.location,
            budget: data.budget,
            specification: data.specification
        }
        mutateAsync(newCustomer)
        alert("Create Customer");
    }

    const { register, handleSubmit, formState: { errors, isSubmitting } }
        = useForm<customer>({ resolver: zodResolver(createCustomerSchema) })

    return (




        <><div>CreateCustomer</div>

            <div>
                <form onSubmit={handleSubmit(createCustomer)} >
                    <label>Id</label>
                    <input type="text"
                        {...register("name", { required: true })}
                        placeholder="name">

                    </input>
                    {errors.name && <div>{errors.name?.message}</div>}
                    <input type="text"
                        {...register("phonenumber", { required: true })}
                        placeholder="phonenumber"></input>
                    {errors.phonenumber && <div>{errors.phonenumber?.message}</div>}
                    <input type="text" placeholder="Location of the Client"
                        {...register("location")}
                        aria-placeholder="Location of the Client"></input>
                    <input type="text"
                        {...register("budget")}
                        placeholder="budget like 10L, 2CR" />
                    <input type="text"
                        {...register("specification")}
                        placeholder="specification like 1 bhk or 2 pbk" />
                    <button disabled={isSubmitting}>{isSubmitting ? "...Submitting" : "Create Custmer"}</button>
                </form>
            </div>
        </>

    )
}

export default CreateCustomer