import { Container, Flex, HStack, Box, Button } from "@chakra-ui/react";
import { Outlet, Link } from "react-router-dom";

const HomePage2 = () => {
    return (
        <Container
            maxW="container.xl"
            p={{ base: 3, md: 5 }}
            borderRadius={10}
            m={{ base: 2, md: 5 }}
            bgGradient="linear(to-br, teal.50, blue.200)"
        >
            <Flex direction="column">

                {/* NAVBAR */}

                <Box
                    textAlign="center"
                    py={{ base: 10, md: 16 }}
                    px={{ base: 4, md: 8 }}
                    bgGradient="linear(to-r, teal.400, blue.500)"
                    color="white"
                    borderRadius="xl"
                    mb={6}
                >
                    <Box
                        fontSize={{ base: "xl", md: "4xl" }}
                        fontWeight="bold"
                    >
                        Learn Smarter with AI 🤖📚
                    </Box>

                    <Box
                        mt={4}
                        fontSize={{ base: "md", md: "lg" }}
                    >
                        Create notes, summaries, question papers & find tutors instantly.
                    </Box>

                    <HStack
                        mt={6}
                        spacing={4}
                        justify="center"
                        flexWrap="wrap"
                        direction={{ base: "column", md: "row" }}
                        w="100%"
                    >

                        {/* PRIMARY CTA */}
                        <Button
                            as={Link}
                            to="/listAllCourse"
                            size="lg"
                            bg="white"
                            color="teal.600"
                            borderRadius="full"
                            px={8}
                            w={{ base: "100%", md: "auto" }}
                            boxShadow="0 6px 20px rgba(0,0,0,0.15)"
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            }}
                        >
                            Explore Courses
                        </Button>
                        <Button
                            as={Link}
                            to="/parent/searchTutor"
                            size="lg"
                            bg="white"
                            color="teal.600"
                            borderRadius="full"
                            px={8}
                            w={{ base: "100%", md: "auto" }}
                            boxShadow="0 6px 20px rgba(0,0,0,0.15)"
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            }}
                        >
                            Find Tutors for Your Child
                        </Button>

                        {/* SECONDARY */}
                        <Button
                            as={Link}
                            to="/login"
                            size="lg"
                            variant="outline"
                            borderColor="white"
                            color="white"
                            borderRadius="full"
                            px={8}
                            w={{ base: "100%", md: "auto" }}
                            _hover={{
                                bg: "whiteAlpha.200",
                            }}
                        >
                            Login / Sign Up
                        </Button>

                        <Button
                            as={Link}
                            to="/"
                            size="lg"
                            variant="outline"
                            borderColor="white"
                            color="white"
                            borderRadius="full"
                            px={8}
                            w={{ base: "100%", md: "auto" }}
                            _hover={{
                                bg: "whiteAlpha.200",
                            }}
                        >
                            Home
                        </Button>



                    </HStack>
                </Box>
                <Outlet />
            </Flex>
        </Container>
    );
};



export default HomePage2;