import { Container, Flex, HStack, VStack, Box } from "@chakra-ui/react";
import { Outlet, Link } from "react-router-dom";

const HomePage2 = () => {
    return (
        <Container
            maxW="container.xl"
            p={{ base: 3, md: 5 }}
            boxShadow="2xl"
            borderRadius={10}
            m={{ base: 2, md: 5 }}
        >
            <Flex direction="column">

                {/* NAVBAR */}
                <Box p={3}>

                    {/* MOBILE VERSION 📱 */}
                    <VStack
                        display={{ base: "flex", md: "none" }}
                        spacing={3}
                        align="stretch"
                    >
                        <Link style={linkStyle} to="/">Home</Link>
                        <Link style={linkStyle} to="/inventory">Inventory</Link>
                        <Link style={linkStyle} to="/listAllCourse">Courses</Link>
                        <Link to="/login">
                            Login / SignUp
                        </Link>
                    </VStack>

                    {/* DESKTOP VERSION 💻 */}
                    <HStack
                        display={{ base: "none", md: "flex" }}
                        spacing={6}
                        justify="flex-end"
                    >
                        <Link style={linkStyle} to="/">Home</Link>
                        <Link style={linkStyle} to="/inventory">Inventory</Link>
                        <Link style={linkStyle} to="/listAllCourse">Courses</Link>
                        <Link to="/login">
                            Login / SignUp
                        </Link>
                    </HStack>

                </Box>

                <Outlet />
            </Flex>
        </Container>
    );
};

const linkStyle = {
    color: "teal",
    fontWeight: "bold",
    textDecoration: "underline",
};



export default HomePage2;