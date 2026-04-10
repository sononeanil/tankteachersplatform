import { Box, Flex, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { MdPlayCircleOutline } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import LandingPageCorousel from "./LandingPageCorousel";
import ViewCourse from "../teacher/ViewCourse";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Filter from "./Filter";

const LandingPage2 = () => {
    const landingPageData = [
        {
            id: 1,
            title: "Welcome to Anil Sonone Teachers Platform",
            description: "Explore our features and services.",
            color: "#dde80fff",
            gradient: "linear-gradient(#dde80fff, #0c98f0ff)",
            value: 1000,
            icon: <AiOutlineHome />,
        },
        {
            id: 2,
            title: "Get Started",
            description: "Learn how to use our platform effectively.",
            color: "#b00ccdff",
            gradient: "linear-gradient(#dde80fff, #0c98f0ff)",
            value: 2000,
            icon: <MdPlayCircleOutline />,
        },
        {
            id: 3,
            title: "Contact Us",
            description: "Reach out for support or inquiries.",
            color: "#37e80fff",
            gradient: "linear-gradient(#dde80fff, #ee7dcaff)",
            value: 2000,
            icon: <AiOutlineMail />,
        },
        {
            id: 4,
            title: "About Us",
            description: "Discover more about our mission and values.",
            color: "#dde80fff",
            gradient: "linear-gradient(#dde80fff, rgba(248, 203, 233, 1))",
            value: 5000,
            icon: <FaInfoCircle />,
        },
    ];

    return (
        <Box px={{ base: 3, md: 6 }}>

            <LandingPageCorousel />
            <Filter />
            <ViewCourse />

            {/* GRID 1 */}
            <SimpleGrid
                columns={{ base: 1, sm: 2, md: 4 }}
                gap={5}
                mt={5}
            >
                {landingPageData.map((data) => (
                    <Flex
                        key={data.id}
                        direction="column"
                        bg={data.color}
                        bgGradient={data.gradient}
                        rounded="md"
                        align="center"
                        color="white"
                        p={4}
                    >
                        <HStack>
                            <Text fontSize="2xl">
                                <Flex gap={2} align="center">
                                    {data.icon}
                                    {data.value}
                                </Flex>
                            </Text>
                        </HStack>

                        <Text>{data.title}</Text>
                    </Flex>
                ))}
            </SimpleGrid>

            {/* GRID 2 */}
            <Flex direction="column" align="center" mt={8}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={5}>
                    {landingPageData.map((item) => (
                        <Flex
                            key={item.id}
                            bg={item.color}
                            bgGradient={item.gradient}
                            borderRadius={10}
                            p={6}
                            minH="150px"
                        >
                            <VStack>
                                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                                    {item.icon} {item.title}
                                </Text>
                                <Text>{item.description}</Text>
                            </VStack>
                        </Flex>
                    ))}
                </SimpleGrid>
            </Flex>

        </Box>
    );
};

export default LandingPage2;