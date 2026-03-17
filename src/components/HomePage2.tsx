import { Container, Flex, HStack, Link } from "@chakra-ui/react"
import { Outlet } from "react-router"

const HomePage2 = () => {
    return (
        <Container maxW={"container.xl"}
            padding={5} boxShadow={"2xl"}
            borderRadius={10} margin={5}>

            <Flex direction={"column"}>

                <HStack spacing={6} p={5} justify={"end"}>
                    <Link href="/" color="teal.500" fontWeight="bold" textDecoration="underline">Home</Link>
                    <Link href="/" color="teal.500" fontWeight="bold" textDecoration="underline">Inventory</Link>
                    <Link href="/" color="teal.500" fontWeight="bold" textDecoration="underline">complete Portfolio</Link>
                    <Link href="/login" bg="blue.500" color="white" px={4} py={2} rounded="md" _hover={{ bg: "green.600" }}>
                        Login To System / SignUp if new user
                    </Link>
                </HStack>
                <Outlet></Outlet>
            </Flex>
        </Container>
    )
}

export default HomePage2