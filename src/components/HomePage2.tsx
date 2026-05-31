import { Container, Flex, Stack, Box, Button } from "@chakra-ui/react";
import { Outlet, Link } from "react-router-dom";

const HomePage2 = () => {
    return (
        <Container
            maxW="container.xl"
            p={{ base: 2, sm: 3, md: 5 }} // Lightened padding for tight screens
            borderRadius={10}
            m={{ base: "4px auto", md: 5 }} // Centered layout margins safely on mobile
            bgGradient="linear(to-br, teal.50, blue.200)"
        >
            <Flex direction="column">

                {/* NAVBAR */}
                <Box
                    textAlign="center"
                    py={{ base: 8, md: 16 }} // Slimmer height on mobile viewports
                    px={{ base: 4, md: 8 }}
                    bgGradient="linear(to-r, teal.400, blue.500)"
                    color="white"
                    borderRadius="xl"
                    mb={6}
                >
                    <Box
                        fontSize={{ base: "2xl", md: "4xl" }} // Adjusted readable scale
                        fontWeight="bold"
                    >
                        Learn Smarter with AI 🤖📚
                    </Box>

                    <Box
                        mt={4}
                        fontSize={{ base: "sm", md: "lg" }}
                    >
                        Create notes, summaries, question papers & find tutors instantly.
                    </Box>

                    {/* FIXED: Swapped HStack for responsive Stack to allow actual layout rotation */}
                    <Stack
                        mt={6}
                        spacing={4}
                        justify="center"
                        direction={{ base: "column", md: "row" }}
                        align="center"
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
                    </Stack>
                </Box>

                {/* INJECTED CHILDREN */}
                <Outlet />
            </Flex>
        </Container>
    );
};

export default HomePage2;