import {
    Box,
    Heading,
    Text,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Badge,
    Divider,
    Container,
    useColorModeValue,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

type Note = {
    note: string;
    explanation: string;
};

type Question = {
    question: string;
    options: string[];
    answer: string;
};

type ChapterData = {
    subject: string;
    chapterName: string;
    notes: Note[];
    summary: string;
    questions: Question[];
};

const ChapterNotesView = () => {
    const { state } = useLocation();
    const data = state as ChapterData;

    const cardBg = useColorModeValue("white", "gray.800");

    // 🚨 Handle refresh / empty state
    if (!data) {
        return (
            <Container py={10}>
                <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    Select a chapter and click "View Notes"
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" py={6}>
            {/* Header */}
            <Box mb={6}>
                <Badge colorScheme="purple" mb={2}>
                    {data.subject}
                </Badge>
                <Heading size="lg">
                    📖 Chapter {data.chapterName}
                </Heading>
            </Box>

            {/* Notes Section */}
            <Heading size="md" mb={4}>
                📘 Concepts
            </Heading>

            <Accordion allowToggle>
                {data.notes.map((item, index) => (
                    <AccordionItem key={index} border="none" mb={3}>
                        <Box
                            bg={cardBg}
                            borderRadius="xl"
                            boxShadow="md"
                            overflow="hidden"
                            _hover={{ boxShadow: "lg" }}
                            transition="0.2s"
                        >
                            <AccordionButton p={4}>
                                <Box flex="1" textAlign="left" fontWeight="bold">
                                    {item.note}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>

                            <AccordionPanel pb={4}>
                                <Text color="gray.600">
                                    {item.explanation}
                                </Text>
                            </AccordionPanel>
                        </Box>
                    </AccordionItem>
                ))}
            </Accordion>

            <Divider my={8} />

            {/* Summary */}
            <Heading size="md" mb={3}>
                ✨ Summary
            </Heading>
            <Box
                bg={cardBg}
                p={4}
                borderRadius="xl"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
            >
                <Text>{data.summary}</Text>
            </Box>

            <Divider my={8} />

            {/* Questions */}
            <Heading size="md" mb={4}>
                📝 Practice Questions
            </Heading>


        </Container>
    );
};

export default ChapterNotesView;