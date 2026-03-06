import { Button, Container, FormControl, FormErrorMessage, FormLabel, GridItem, Input, SimpleGrid, useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { mutationCreateStudent } from "../../Api";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { studentSchema, type StudentType } from "../../types/userType";

const data = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 20 },
    { name: "May", value: 75 },
    { name: "June", value: 75 },
    { name: "July", value: 60 },
    { name: "August", value: 75 },
    { name: "September", value: 75 },
];


const EnrollStudent = () => {
    const toast = useToast();

    const userInfoString = localStorage.getItem("loggedInUser");
    const { id } = userInfoString ? JSON.parse(userInfoString) : {};
    const { mutateAsync } = useMutation({
        mutationFn: mutationCreateStudent,

        onError: (err: any) => {
            toast({
                title: "CreateStudent failed",
                description: err.message,
                status: "error",
                duration: null,
                isClosable: true,
                position: "top",
            });

        },
        onSuccess: () => {
            // console.log("Registration successful");
            reset();
            toast({
                title: "CreateStudent successful!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",

            });
        },
    })

    const createStudent: SubmitHandler<StudentType> = (data: StudentType) => {
        alert("Creating student for parent id: " + id);
        const newStudent: StudentType = {
            id: 0,
            firstName: data.firstName,
            lastName: data.lastName,
            nickName: data.nickName,
            email: data.email,
            age: data.age,
            classEntrolled: data.classEntrolled,
            middleName: data.middleName,
            gender: data.gender,
            subjectEnrolled: data.subjectEnrolled,
            attendancePercentage: data.attendancePercentage,
            dateOfBirth: data.dateOfBirth,
            dateOfAdmission: data.dateOfAdmission,
            parentId: data.parentId,
            loginId: data.firstName.toLowerCase() + id + "@sp.com",
            password: data.password,
            //Entity: data.//Entity,
        }
        mutateAsync(newStudent)
        // alert("Create newStudent");
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(studentSchema),
    });

    return (
        <>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            <Container maxW={"container.lg"}
                padding={10} boxShadow={"2xl"}
                borderRadius={10} bg={"white"}>
                <form onSubmit={handleSubmit(createStudent)} >
                    <SimpleGrid columns={2}
                        columnGap={3} rowGap={5} spacing={10} width={"full"}>

                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.firstName}>
                                <FormLabel>firstName </FormLabel>
                                <Input placeholder="Enter your firstName" {...register("firstName")}
                                    _hover={{ borderColor: "green.500" }}
                                    borderColor="blue.400"
                                    borderWidth="2px" />
                                <FormErrorMessage>
                                    {errors.firstName && errors.firstName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.lastName}>
                                <FormLabel>lastName </FormLabel>
                                <Input placeholder="Enter your lastName" {...register("lastName")} />
                                <FormErrorMessage>
                                    {errors.lastName && errors.lastName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.nickName}>
                                <FormLabel>nickName </FormLabel>
                                <Input placeholder="Enter your nickName" {...register("nickName")} />
                                <FormErrorMessage>
                                    {errors.nickName && errors.nickName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.email}>
                                <FormLabel>email </FormLabel>
                                <Input placeholder="Enter your email" {...register("email")} />
                                <FormErrorMessage>
                                    {errors.email && errors.email.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.password}>
                                <FormLabel>student Password </FormLabel>
                                <Input placeholder="Enter student password" {...register("password")} />
                                <FormErrorMessage>
                                    {errors.password && errors.password.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.loginId}>
                                <FormLabel>student loginId </FormLabel>
                                <Input placeholder="Enter student loginId" {...register("loginId")} />
                                <FormErrorMessage>
                                    {errors.loginId && errors.loginId.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.age}>
                                <FormLabel>age </FormLabel>
                                <Input placeholder="Enter your age" {...register("age", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.age && errors.age.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.classEntrolled}>
                                <FormLabel>classEntrolled </FormLabel>
                                <Input placeholder="Enter your classEntrolled" {...register("classEntrolled")} />
                                <FormErrorMessage>
                                    {errors.classEntrolled && errors.classEntrolled.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.middleName}>
                                <FormLabel>middleName </FormLabel>
                                <Input placeholder="Enter your middleName" {...register("middleName")} />
                                <FormErrorMessage>
                                    {errors.middleName && errors.middleName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.gender}>
                                <FormLabel>gender </FormLabel>
                                <Input placeholder="Enter your gender" {...register("gender")} />
                                <FormErrorMessage>
                                    {errors.gender && errors.gender.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.subjectEnrolled}>
                                <FormLabel>subjectEnrolled </FormLabel>
                                <Input placeholder="Enter your subjectEnrolled" {...register("subjectEnrolled")} />
                                <FormErrorMessage>
                                    {errors.subjectEnrolled && errors.subjectEnrolled.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.attendancePercentage}>
                                <FormLabel>attendancePercentage </FormLabel>
                                <Input placeholder="Enter your attendancePercentage" {...register("attendancePercentage")} />
                                <FormErrorMessage>
                                    {errors.attendancePercentage && errors.attendancePercentage.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.dateOfBirth}>
                                <FormLabel>dateOfBirth </FormLabel>
                                <Input placeholder="Enter your dateOfBirth" {...register("dateOfBirth")} />
                                <FormErrorMessage>
                                    {errors.dateOfBirth && errors.dateOfBirth.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.dateOfAdmission}>
                                <FormLabel>dateOfAdmission </FormLabel>
                                <Input placeholder="Enter your dateOfAdmission" {...register("dateOfAdmission")} />
                                <FormErrorMessage>
                                    {errors.dateOfAdmission && errors.dateOfAdmission.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.parentId}>
                                <FormLabel>parentId </FormLabel>
                                <Input placeholder="Enter your parentId" {...register("parentId")} value={id} />
                                <FormErrorMessage>
                                    {errors.parentId && errors.parentId.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={2}>
                            <FormControl>
                                <Button type="submit" colorScheme="blue">Submit</Button>
                            </FormControl>
                        </GridItem>


                    </SimpleGrid>

                </form>
            </Container >


        </>
    )
}

export default EnrollStudent