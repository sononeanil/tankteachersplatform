import { Container, Flex, HStack } from "@chakra-ui/react"
import { Outlet, Link } from "react-router-dom"

const HomePage2 = () => {
    return (
        <Container maxW={"container.xl"} p={5} boxShadow={"2xl"} borderRadius={10} m={5}>
            <Flex direction={"column"}>
                <HStack spacing={6} p={5} justify={"end"}>

                    <Link to="/" style={{ color: "teal", fontWeight: "bold", textDecoration: "underline" }}>
                        Home
                    </Link>

                    <Link to="/inventory" style={{ color: "teal", fontWeight: "bold", textDecoration: "underline" }}>
                        Inventory
                    </Link>

                    <Link to="/listAllCourse" style={{ color: "teal", fontWeight: "bold", textDecoration: "underline" }}>
                        List All Courses
                    </Link>

                    <Link
                        to="/login"
                        style={{
                            background: "blue",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "6px"
                        }}
                    >
                        Login To System / SignUp if new user
                    </Link>

                </HStack>

                <Outlet />
            </Flex>
        </Container>
    )
}

export default HomePage2