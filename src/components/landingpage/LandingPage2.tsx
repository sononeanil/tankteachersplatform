import { Box, Flex, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { MdPlayCircleOutline } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import LandingPageCorousel from "./LandingPageCorousel";
import ViewCourse from "../teacher/ViewCourse";
import Filter from "./Filter";
import DetailedNotesFilter from "../notes/DetailedNotesFilter";
import MsbFilter from "./MsbFilter";
import SendMessageToAdmin from "./SendMessageToAdmin";


import { Link as RouterLink } from "react-router-dom";

const LandingPage2 = () => {
    // Explicitly declaring the array here so Vite handles compilation perfectly
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
            title: "Write email to admin on anilsonone@gmail.com",
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

    const getTextColor = (colorCode: string) => {
        return colorCode === "#dde80fff" ? "gray.800" : "white";
    };

    return (
        // Root component constraints to force mobile responsiveness
        <Box width="100%" maxW="100%" mx="auto" py={2} overflow="hidden">


            {/* 1. HERO CAROUSEL */}
            <Box width="100%" overflow="hidden" mb={2}>
                <LandingPageCorousel />
            </Box>

            {/* 2. FILTERS & SEARCH CONTROLS */}
            <VStack spacing={3} align="stretch" my={4} width="100%" overflowX="auto">
                <Filter />
                <DetailedNotesFilter />
                <MsbFilter />
                <SendMessageToAdmin />
                {/* <ChapterListFilter /> */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px", margin: "20px 0", fontFamily: "system-ui, sans-serif" }}>
                    <h3 style={{ margin: "0 0 4px 0", color: "#4A5568", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        📚 Class 9 Science Revision Chapters
                    </h3>

                    <Box
                        as={RouterLink}
                        to="/notes/last-minute-revision/board/cbse/subject/science?key=Class_9_Science&chapter=Chapter+1"
                        display="block"
                        padding="14px 16px"
                        border="1px solid #E2E8F0"
                        borderRadius="8px"
                        backgroundColor="#FFF"
                        color="#2B6CB0"
                        fontWeight="500"
                        _hover={{ backgroundColor: "gray.50", borderColor: "gray.300" }}
                    >
                        📁 Class 9 Science - Chapter 1: Matter in Our Surroundings
                    </Box>

                    <a
                        href="/notes/last-minute-revision/board/cbse/subject/science?key=Class_9_Science&chapter=Chapter+2"
                        style={{ display: "block", padding: "14px 16px", border: "1px solid #E2E8F0", borderRadius: "8px", backgroundColor: "#FFF", color: "#2B6CB0", textDecoration: "none", fontWeight: "500" }}
                    >
                        📁 Class 9 Science - Chapter 2: Cell Notes
                    </a>

                    <a
                        href="/notes/last-minute-revision/board/cbse/subject/science?key=Class_9_Science&chapter=Chapter+3%3A+Tissues+in+Action"
                        style={{ display: "block", padding: "14px 16px", border: "1px solid #E2E8F0", borderRadius: "8px", backgroundColor: "#FFF", color: "#2B6CB0", textDecoration: "none", fontWeight: "500" }}
                    >
                        📁 Class 9 Science - Chapter 3: Tissues in Action
                    </a>


                </div>

            </VStack>

            {/* 3. GRID 1: Analytics Dashboard (The Boxes) */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4} mb={6} width="100%"
                shadow={"xl"} marginTop={5}>
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
                            p={4}
                            minH={{ base: "auto", md: "90px" }}
                            h="100%"
                        >
                            <HStack spacing={2} mb={1} >
                                <Text fontSize="xl">{data.icon}</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                    {data.value}
                                </Text>
                            </HStack>
                            <Text fontSize="xs" fontWeight="medium" opacity={0.9} noOfLines={{ base: 2, md: 1 }}>
                                {data.title}
                            </Text>
                        </Flex>
                    );
                })}
            </SimpleGrid>





            {/* 5. GRID 2: Detailed Feature Cards */}
            <Box mt={6} mb={4} width="100%">

                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4} width="100%">
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
                                minH={{ base: "auto", md: "130px" }}
                                h="100%"
                                color={textColor}
                            >
                                <VStack align="start" spacing={2} h="100%" justify="space-between">
                                    <Box width="100%">
                                        <HStack spacing={2} width="100%" mb={1}>
                                            <Text fontSize="md">{item.icon}</Text>
                                            <Text fontSize="sm" fontWeight="bold" noOfLines={{ base: 2, md: 1 }}>
                                                {item.title}
                                            </Text>
                                        </HStack>
                                        <Text fontSize="xs" opacity={0.85} lineHeight="normal" noOfLines={{ base: 4, md: 3 }}>
                                            {item.description}
                                        </Text>
                                    </Box>
                                </VStack>
                            </Flex>
                        );
                    })}
                </SimpleGrid>
            </Box>
            {/* 4. COURSE VIEW / LISTINGS */}
            <Box my={4} width="100%" overflow="hidden">
                <ViewCourse />
            </Box>
        </Box>
    );
};

export default LandingPage2;