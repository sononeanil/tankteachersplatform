import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    VStack,
    Box,
    Heading,
    Text,
    Badge,
    HStack,
    Icon,
    Alert,
    AlertIcon,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from "@chakra-ui/react";
import { FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";

// --- Interfaces for Type Safety ---
interface TextbookSolutionItem {
    questionNumber: string;
    textbookQuestion: string;
    modelAnswer: string;
}

interface ChapterNode {
    nodeType: string;
    sectionOrTheme: string;
    fullTextbookSolutions?: TextbookSolutionItem[];
}

interface OutletContextType {
    // We fetch the dynamic array or pass the parent's parsed list directly
    themesList?: ChapterNode[];
    isLoading: boolean;
}

const EnglishNotesTextbookExcercise = () => {
    // 1. Grab context parameters from the parent container
    const { themesList, isLoading } = useOutletContext<any>();

    // 2. Safely isolate the 'textbook_exercise_section' node array elements 
    const solutionsList = React.useMemo<TextbookSolutionItem[]>(() => {
        if (!themesList || !Array.isArray(themesList)) return [];

        // Find the node where type matches textbook layout
        const solutionsNode = themesList.find(
            (node: any) => node?.nodeType === "textbook_exercise_section"
        );

        return solutionsNode?.fullTextbookSolutions || [];
    }, [themesList]);

    // Show nothing while parent query sync is fetching
    if (isLoading) {
        return null;
    }

    // Fallback Alert if no NCERT/Textbook solutions exist inside this specific layout node array
    if (solutionsList.length === 0) {
        return (
            <Alert status="info" borderRadius="xl" variant="subtle">
                <AlertIcon />
                No textbook exercises or formal model questions found for this chapter module.
            </Alert>
        );
    }

    return (
        <VStack spacing={6} align="stretch" w="full">
            {/* Component Title Header */}
            <HStack justify="space-between" align="center" wrap="wrap" gap={2}>
                <HStack spacing={2}>
                    <Icon as={MdMenuBook} w={6} h={6} color="blue.500" />
                    <Heading size="md" color="gray.800" fontWeight="bold">
                        NCERT Textbook Solutions
                    </Heading>
                </HStack>
                <Badge colorScheme="blue" px={3} py={1} borderRadius="full" textTransform="none">
                    ✨ Model Board Answers
                </Badge>
            </HStack>

            {/* Accordion List Wrapper */}
            <Accordion allowToggle defaultIndex={[0]} reduceMotion>
                {solutionsList.map((item, index) => (
                    <AccordionItem
                        key={index}
                        border="1px solid"
                        borderColor="gray.100"
                        borderRadius="xl"
                        mb={3}
                        overflow="hidden"
                        bg="white"
                        boxShadow="sm"
                    >
                        <h2>
                            <AccordionButton
                                _expanded={{ bg: 'blue.50', color: 'blue.800' }}
                                p={4}
                                _hover={{ bg: 'gray.50' }}
                            >
                                <HStack flex="1" textAlign="left" spacing={3}>
                                    <Badge colorScheme="blue" variant="solid" px={2} borderRadius="md">
                                        Q{item.questionNumber || index + 1}
                                    </Badge>
                                    <Text fontWeight="bold" fontSize="sm" noOfLines={1} color="gray.700">
                                        {item.textbookQuestion}
                                    </Text>
                                </HStack>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>

                        <AccordionPanel pb={5} pt={4} px={5} bg="white">
                            <VStack align="stretch" spacing={4}>
                                {/* Core Question Block */}
                                <Box>
                                    <Text fontWeight="bold" fontSize="xs" color="gray.400" textTransform="uppercase" mb={1}>
                                        Question Prompt
                                    </Text>
                                    <Text color="gray.800" fontSize="md" fontWeight="medium" lineHeight="relaxed">
                                        {item.textbookQuestion}
                                    </Text>
                                </Box>

                                {/* CBSE Evaluated Answer Block */}
                                <Box bg="gray.50" p={4} borderRadius="xl" borderLeft="4px solid" borderColor="blue.400">
                                    <HStack mb={2} spacing={2}>
                                        <Icon as={FaCheckCircle} color="blue.500" w={4} h={4} />
                                        <Text fontWeight="bold" fontSize="xs" color="blue.700" textTransform="uppercase" letterSpacing="wider">
                                            CBSE Standard Model Answer
                                        </Text>
                                    </HStack>
                                    <Text color="gray.700" fontSize="md" lineHeight="tall" whiteSpace="pre-line">
                                        {item.modelAnswer}
                                    </Text>
                                </Box>
                            </VStack>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </VStack>
    );
};

export default EnglishNotesTextbookExcercise;