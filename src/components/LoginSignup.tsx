import { Text, Container, Flex, VStack, GridItem, FormControl, FormLabel, Input, Button, SimpleGrid, Heading, FormErrorMessage, useToast } from "@chakra-ui/react"
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
            // firstName: data.firstName,
            // lastName: data.lastName,
            // address: data.address,
            // city: data.city,
            // country: data.country,
            // newsLetter: data.newsLetter,
            email: data.email,
            password: data.password,
            // type: data.type,
            phoneNumber: data.phoneNumber,
            alternateEmailId: data.alternateEmailId,
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

        <Container
            maxW="container.lg"
            p={{ base: 4, md: 10 }}
            boxShadow="2xl"
            borderRadius={10}
        >

            <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 6, md: 10 }}
            >
                <VStack spacing={10}
                    width={"full"}
                    h={"full"}
                    p={10}
                    align={"flex-start"}
                    border="1px solid"
                    borderColor="green.300"
                    borderRadius={10}
                    boxShadow="2xl"
                    mr={{ base: 0, md: 10 }}
                    bgGradient="linear(to-r, red.100, green.100)">
                    {/* Add your landing page content here */}
                    <VStack w={{ base: "full" }}>
                        <Heading size={"md"}>Login - Existing User</Heading>
                        <Text>If you are already registered user , please login here</Text>
                    </VStack>

                    <form onSubmit={loginFormHandleSubmit(createLogin)} >
                        <SimpleGrid columns={{ base: 1, md: 2 }}
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

                            <GridItem colSpan={2}>
                                <FormControl isInvalid={!!errors.email}>
                                    <FormLabel>User Id in email format ONLY </FormLabel>
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
                                <FormControl isInvalid={!!errors.alternateEmailId}>
                                    <FormLabel>Email for all communications </FormLabel>
                                    <Input

                                        placeholder="All communication, will use this email id"
                                        {...register("alternateEmailId", { required: "Alternate email is required" })}
                                    />
                                    <FormErrorMessage>
                                        {errors.alternateEmailId && errors.alternateEmailId.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <FormControl isInvalid={!!errors.phoneNumber}>
                                    <FormLabel>Phone Number </FormLabel>
                                    <Input

                                        placeholder="Enter your phone number"
                                        {...register("phoneNumber", { required: "Phone number is required" })}
                                    />
                                    <FormErrorMessage>
                                        {errors.phoneNumber && errors.phoneNumber.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={2}>

                                <FormControl isInvalid={!!errors.password}>
                                    <FormLabel>Password </FormLabel>
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