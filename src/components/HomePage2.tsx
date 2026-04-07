import { Container, Flex, HStack, Box, Button } from "@chakra-ui/react";
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
                    <HStack
                        display={{ base: "flex", md: "none" }}
                        spacing={3}
                        wrap="wrap"
                    >
                        <Link style={linkStyle} to="/">Home</Link>
                        <Link style={linkStyle} to="/listAllCourse">Courses</Link>

                        <Button
                            as={Link}
                            to="/login"
                            colorScheme="blue"
                            borderRadius="lg"
                        >
                            Login / Sign Up
                        </Button>
                    </HStack>

                    {/* DESKTOP VERSION 💻 */}
                    <HStack
                        display={{ base: "none", md: "flex" }}
                        spacing={6}
                        justify="flex-end"
                    >
                        <Link style={linkStyle} to="/">Home</Link>
                        <Link style={linkStyle} to="/listAllCourse">Courses</Link>
                        <Button
                            as={Link}
                            to="/login"
                            colorScheme="blue"
                            variant="solid"
                            size="md"
                            borderRadius="lg"
                        >
                            Login / Sign Up
                        </Button>
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