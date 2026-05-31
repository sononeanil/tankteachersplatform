import { Box, Flex, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { MdPlayCircleOutline } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import LandingPageCorousel from "./LandingPageCorousel";
import ViewCourse from "../teacher/ViewCourse";
import Filter from "./Filter";
import DetailedNotesFilter from "../notes/DetailedNotesFilter";
import MsbFilter from "./MsbFilter";

const LandingPage2 = () => {
    const landingPageData = [
        {
            id: 1,
            title: "One hour before exam notes for CBSE classes 6 to 12",
            description: "Notes from class 6 to 12, covering all subjects and chapters.",
            color: "#dde80fff",
            gradient: "linear-gradient(#dde80fff, #0c98f0ff)",
            value: "50+",
            icon: <AiOutlineHome />,
        },
        {
            id: 2,
            title: "Treeview, Detailed level notes",
            description: "Get ready for your exams with our concise review notes.",
            color: "#b00ccdff",
            gradient: "linear-gradient(#b00ccdff, #ee7dcaff)",
            value: "450+",
            icon: <MdPlayCircleOutline />,
        },
        {
            id: 3,
            title: "Contact Us",
            description: "Contact admin at anilsonone@gmail.com for support.",
            color: "#37e80fff",
            gradient: "linear-gradient(#37e80fff, #0c98f0ff)",
            value: "24/7",
            icon: <AiOutlineMail />,
        },
        {
            id: 4,
            title: "Mindmap, mcq, flowchart and Venn Diagram",
            description: "Visualize information and relationships with our interactive tools.",
            color: "#dde80fff",
            gradient: "linear-gradient(#dde80fff, rgba(248, 203, 233, 1))",
            value: "100+",
            icon: <FaInfoCircle />,
        },
    ];

    const getTextColor = (colorCode) => {
        return colorCode === "#dde80fff" ? "gray.800" : "white";
    };

    return (
        // Max width constraint strictly matches a proportional container layout
        <Box px={{ base: 4, md: 6 }} maxW="1200px" mx="auto" my={3}>

            {/* 1. HERO CAROUSEL */}
            <LandingPageCorousel />

            {/* 2. FILTERS & SEARCH CONTROLS (Tighter vertical margins) */}
            <VStack spacing={3} align="stretch" my={4}>
                <Filter />
                <DetailedNotesFilter />
                <MsbFilter />
            </VStack>

            {/* 3. GRID 1: Analytics Dashboard (Slimmer cards to match carousel thickness) */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4} mb={6}>
                {landingPageData.map((data) => {
                    const textColor = getTextColor(data.color);
                    return (
                        <Flex
                            key={data.id}
                            direction="column"
                            justify="center"
                            bg={data.color}
                            bgGradient={data.gradient}
                            rounded="lg"
                            boxShadow="sm"
                            color={textColor}
                            p={3} // Compact padding
                            minH="90px" // Short height to prevent vertical stretching
                        >
                            <HStack spacing={2} mb={1}>
                                <Text fontSize="xl">{data.icon}</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                    {data.value}
                                </Text>
                            </HStack>
                            <Text fontSize="xs" fontWeight="medium" opacity={0.9} noOfLines={1}>
                                {data.title}
                            </Text>
                        </Flex>
                    );
                })}
            </SimpleGrid>

            {/* 4. COURSE VIEW / LISTINGS */}
            <Box my={4}>
                <ViewCourse />
            </Box>

            {/* 5. GRID 2: Detailed Feature Cards (Proportional heights) */}
            <Box mt={6} mb={4}>
                <Text fontSize="lg" fontWeight="bold" mb={3} textAlign="center">
                    Our Features & Resources
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
                    {landingPageData.map((item) => {
                        const textColor = getTextColor(item.color);
                        return (
                            <Flex
                                key={item.id}
                                direction="column"
                                bg={item.color}
                                bgGradient={item.gradient}
                                borderRadius="lg"
                                boxShadow="sm"
                                p={4}
                                minH="130px" // Scaled down from 180px to align with the slim carousel
                                color={textColor}
                            >
                                <VStack align="start" spacing={2}>
                                    <HStack spacing={2} width="100%">
                                        <Text fontSize="md">{item.icon}</Text>
                                        <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                                            {item.title}
                                        </Text>
                                    </HStack>
                                    <Text fontSize="xs" opacity={0.85} lineHeight="normal" noOfLines={3}>
                                        {item.description}
                                    </Text>
                                </VStack>
                            </Flex>
                        );
                    })}
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default LandingPage2;