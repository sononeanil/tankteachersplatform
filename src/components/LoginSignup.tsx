import { Text, Container, Flex, VStack, GridItem, FormControl, FormLabel, Input, Button, SimpleGrid, Select, Checkbox, Heading, FormErrorMessage, useToast } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useForm, type SubmitHandler } from "react-hook-form"
import { loginSchema, userSchema, type LoginType, type UserType } from "../types/userType"
import { mutationCreateLogin, mutationCreateUser } from "../Api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useSearchParams } from "react-router-dom"


const LoginSignup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { mutateAsync: mutationAsynchLogin } = useMutation({
        mutationFn: mutationCreateLogin,
        onSuccess: () => {
            const courseId = searchParams.get("courseId");
            if (courseId) {
                navigate(`/db2/registerCourse?courseId=${courseId}`);
                return;
            }
            navigate("/db2");

        },
        onError: (err: any) => {
            toast({
                title: "Login failed",
                description: err.message,
                status: "error",
                duration: null,   // stays until user closes
                isClosable: true,
                position: "top",
            });
        }
    })
    const createLogin: SubmitHandler<LoginType> = (data: LoginType) => {
        const newLogin: LoginType = {
            id: 0,
            userId: data.userId,
            password: data.password,
        }
        mutationAsynchLogin(newLogin)
        // alert("Create newLogin");
    }
    const toast = useToast();

    const { mutateAsync } = useMutation({
        mutationFn: mutationCreateUser,
        onError: (err: any) => {
            toast({
                title: "Registration failed",
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
                title: "Registration successful!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",

            });
        },


    })

    const createUser: SubmitHandler<UserType> = (data: UserType) => {
        const newUser: UserType = {
            id: 0,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            country: data.country,
            newsLetter: data.newsLetter,
            email: data.email,
            password: data.password,
            type: data.type,
            //Entity: data.//Entity,
        }
        mutateAsync(newUser)
        // alert("Create newUser");
    }

    const { register, handleSubmit, reset, formState: { errors } }
        = useForm<UserType>({ resolver: zodResolver(userSchema) })

    const { register: loginFormRegister, handleSubmit: loginFormHandleSubmit, formState: { errors: loginFormErrors } }
        = useForm<LoginType>({ resolver: zodResolver(loginSchema) })


    return (

        <Container maxW={"container.lg"}
            padding={10} boxShadow={"2xl"}
            borderRadius={10}>
            <Flex>
                <VStack spacing={10}
                    width={"full"}
                    h={"full"}
                    p={10}
                    align={"flex-start"}
                    border="1px solid"
                    borderColor="green.300"
                    borderRadius={10}
                    boxShadow="2xl"
                    mr={10}
                    bgGradient="linear(to-r, red.100, green.100)">
                    {/* Add your landing page content here */}
                    <VStack>
                        <Heading size={"md"}>Login - Existing User</Heading>
                        <Text>If you are already registered user , please login here</Text>
                    </VStack>

                    <form onSubmit={loginFormHandleSubmit(createLogin)} >
                        <SimpleGrid columns={2}
                            columnGap={3} rowGap={5} spacing={10} width={"full"}>
                            <GridItem colSpan={2}>

                                <FormControl isInvalid={!!loginFormErrors.userId}>
                                    <FormLabel>Your Registerd email id </FormLabel>
                                    <Input

                                        placeholder="Enter your userId"
                                        {...loginFormRegister("userId", { required: "Email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {loginFormErrors.userId && loginFormErrors.userId.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>


                            <GridItem colSpan={2}>

                                <FormControl isInvalid={!!loginFormErrors.password}>
                                    <FormLabel>password </FormLabel>
                                    <Input type="password"

                                        placeholder="Enter your password"
                                        {...loginFormRegister("password", { required: "Email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {loginFormErrors.password && loginFormErrors.password.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <FormControl>
                                    <Button type="submit" colorScheme="blue" width={"full"}>Submit</Button>
                                </FormControl>
                            </GridItem>
                            {/* <GridItem colSpan={2}>
                                <FormControl >
                                    <Button colorScheme="blue" mr={5} >User Login</Button>
                                    <Button colorScheme="blue"> <Link to="/db2">Default Login</Link> </Button>
                                </FormControl>
                            </GridItem> */}
                        </SimpleGrid>
                    </form>



                </VStack>

                <VStack spacing={10}
                    bgGradient="linear(to-r, yellow.100, teal.200, pink.100)"
                    width={"full"}
                    h={"full"}
                    p={10}
                    align={"flex-start"}
                    borderRadius={10}
                    boxShadow="2xl">

                    <VStack>
                        <Heading textAlign={"start"} size={"md"}>Welcome to Our Application <br></br> - Sign Up/ New User</Heading>
                        <Text>If you are new , please register your self</Text>
                    </VStack>


                    <form onSubmit={handleSubmit(createUser)} >
                        <SimpleGrid columns={2}
                            columnGap={3} rowGap={5} spacing={10} width={"full"}>
                            <GridItem colSpan={1}>

                                <FormControl isInvalid={!!errors.firstName}>
                                    <FormLabel>firstName </FormLabel>
                                    <Input

                                        placeholder="Enter your firstName"
                                        {...register("firstName", { required: "Email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {errors.firstName && errors.firstName.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>




                            <GridItem colSpan={1}>

                                <FormControl isInvalid={!!errors.lastName}>
                                    <FormLabel>lastName </FormLabel>
                                    <Input

                                        placeholder="Enter your lastName"
                                        {...register("lastName", { required: "Email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {errors.lastName && errors.lastName.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>




                            <GridItem colSpan={1}>

                                <FormControl isInvalid={!!errors.address}>
                                    <FormLabel>address </FormLabel>
                                    <Input

                                        placeholder="Enter your address"
                                        {...register("address", { required: "Email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {errors.address && errors.address.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>




                            <GridItem colSpan={1}>

                                <FormControl isInvalid={!!errors.city}>
                                    <FormLabel>city </FormLabel>
                                    <Input

                                        placeholder="Enter your city"
                                        {...register("city", { required: "Email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {errors.city && errors.city.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <FormControl>
                                    <FormLabel>Country</FormLabel>
                                    <Select placeholder="Select Country">
                                        <option>India</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>Australia</option>

                                    </Select>
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <FormControl>
                                    <Checkbox>Subscribe to Newsletter</Checkbox>
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <FormControl>
                                    <FormLabel>Please Select Type</FormLabel>
                                    <Select placeholder="Select Category">
                                        <option>Individula Parent</option>
                                        <option>School</option>
                                        <option>Trainer</option>
                                        <option>Scociety</option>
                                    </Select>
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <FormControl isInvalid={!!errors.email}>
                                    <FormLabel>email </FormLabel>
                                    <Input

                                        placeholder="Enter your email"
                                        {...register("email", { required: "Email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {errors.email && errors.email.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>




                            <GridItem colSpan={2}>

                                <FormControl isInvalid={!!errors.password}>
                                    <FormLabel>password </FormLabel>
                                    <Input type="password"

                                        placeholder="Enter your password"
                                        {...register("password", { required: "Email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {errors.password && errors.password.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>


                            <GridItem colSpan={2}>
                                <FormControl>
                                    <FormLabel>Comfirm Password</FormLabel>
                                    <Input type="password" placeholder="Re enter your password" />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <FormControl>
                                    <Button type="submit" colorScheme="blue" width={"full"}>Submit</Button>
                                </FormControl>
                            </GridItem>

                        </SimpleGrid>
                    </form>
                </VStack>

            </Flex >
        </Container >
    )
}

export default LoginSignup