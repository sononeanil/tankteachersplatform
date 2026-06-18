import { useOutletContext } from 'react-router-dom';
import {
    VStack,
    Box,
    Heading,
    Text,
    Badge,
    SimpleGrid,
    HStack,
    Icon,
    Divider,
    List,
    ListItem,
    ListIcon,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import {
    FaBookOpen,
    FaLightbulb,
    FaBookmark,
    FaQuoteLeft,
    FaPenSquare
} from "react-icons/fa";

// --- Shared Interfaces ---
interface VocabularyItem {
    word: string;
    meaning: string;
}

interface AnalysisPayload {
    note?: string;
    explanation?: string;
    answersTextbookQuestion?: string;
    literaryDevices?: string[];
    contextualVocabulary?: VocabularyItem[];
    criticalAnalysisTip?: string;
}

interface ChapterNode {
    nodeType: string;
    sectionOrTheme: string;
    analysis?: AnalysisPayload;
    quickCheckMCQs?: any[];
    cbseExtractBasedQuestions?: any[];
    cbseCompetencyLongAnswers?: any[];
}

interface OutletContextType {
    themesList: ChapterNode[];
    isLoading: boolean;
}

const EnglishNotesNarrativeNote = () => {
    const context = useOutletContext<OutletContextType>();

    // DIAGNOSTIC 3: Validating what has landed down into React Router's child channel instance
    console.log("📥 Child Component React Router Context Received:", context);

    const { themesList, isLoading } = context || { themesList: [], isLoading: false };

    if (isLoading) {
        return null;
    }

    if (!themesList || themesList.length === 0) {
        return (
            <Alert status="info" borderRadius="xl" variant="subtle">
                <AlertIcon />
                Please choose a chapter module above to view the structured study notes.
            </Alert>
        );
    }

    return (
        <VStack spacing={8} align="stretch" w="full">
            {themesList.map((node, index) => (
                <Box
                    key={index}
                    p={{ base: 5, md: 6 }}
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="gray.100"
                    bg="white"
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{ boxShadow: "md", borderColor: "purple.100" }}
                >
                    {/* Header Block */}
                    <HStack justify="space-between" align="start" mb={4} wrap="wrap" gap={2}>
                        <Heading size="md" color="gray.800" fontWeight="bold">
                            {node.sectionOrTheme}
                        </Heading>
                        <Badge colorScheme="purple" px={3} py={1} borderRadius="full" textTransform="none">
                            ✨ Narrative Analysis
                        </Badge>
                    </HStack>

                    <Divider my={3} />

                    {/* Main Core Notes & Explanations */}
                    <VStack spacing={4} align="stretch" mt={3}>
                        {node.analysis?.note && (
                            <HStack align="start" spacing={3}>
                                <Icon as={FaBookOpen} color="blue.500" mt={1} />
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm" color="gray.600">Summary Note</Text>
                                    <Text color="gray.700" fontSize="md">{node.analysis.note}</Text>
                                </Box>
                            </HStack>
                        )}

                        {node.analysis?.explanation && (
                            <HStack align="start" spacing={3}>
                                <Icon as={FaLightbulb} color="yellow.500" mt={1} />
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm" color="gray.600">Deep Explanation</Text>
                                    <Text color="gray.700" fontSize="md">{node.analysis.explanation}</Text>
                                </Box>
                            </HStack>
                        )}

                        {node.analysis?.contextualVocabulary && node.analysis.contextualVocabulary.length > 0 && (
                            <Box bg="gray.50" p={4} borderRadius="xl" mt={2}>
                                <Text fontWeight="bold" fontSize="sm" color="purple.700" mb={2} display="flex" alignItems="center" gap={2}>
                                    <Icon as={FaBookmark} /> Contextual Vocabulary
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                                    {node.analysis.contextualVocabulary.map((vocab, vIdx) => (
                                        <Box key={vIdx} bg="white" p={2} px={3} borderRadius="md" border="1px solid" borderColor="gray.200">
                                            <Text fontSize="sm" fontWeight="bold" color="purple.600">{vocab.word}</Text>
                                            <Text fontSize="xs" color="gray.600">{vocab.meaning}</Text>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </Box>
                        )}

                        {node.analysis?.literaryDevices && node.analysis.literaryDevices.length > 0 && (
                            <Box mt={1}>
                                <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>Literary Devices</Text>
                                <List spacing={1}>
                                    {node.analysis.literaryDevices.map((device, dIdx) => (
                                        <ListItem key={dIdx} fontSize="sm" color="gray.700" display="flex" alignItems="center">
                                            <ListIcon as={FaQuoteLeft} color="pink.400" w={3} h={3} />
                                            {device}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {node.analysis?.criticalAnalysisTip && (
                            <Alert status="warning" variant="left-accent" borderRadius="lg" mt={2} py={3}>
                                <VStack align="stretch" spacing={0}>
                                    <Text fontWeight="bold" fontSize="xs" color="orange.800" textTransform="uppercase">
                                        💡 Exam Scoring Tip
                                    </Text>
                                    <Text fontSize="sm" color="gray.700">
                                        {node.analysis.criticalAnalysisTip}
                                    </Text>
                                </VStack>
                            </Alert>
                        )}

                        {node.cbseExtractBasedQuestions && node.cbseExtractBasedQuestions.length > 0 && (
                            <Box border="1px solid" borderColor="teal.100" bg="teal.50" p={4} borderRadius="xl" mt={3}>
                                <Text fontWeight="bold" fontSize="sm" color="teal.800" mb={2} display="flex" alignItems="center" gap={2}>
                                    <Icon as={FaPenSquare} /> CBSE Extract-Based Reference
                                </Text>
                                {node.cbseExtractBasedQuestions.map((extract, eIdx) => (
                                    <VStack key={eIdx} align="stretch" spacing={2}>
                                        <Box bg="white" p={3} borderRadius="md" fontStyle="italic" borderLeft="4px solid" borderColor="teal.400">
                                            "{extract.verbatimExcerpt}"
                                        </Box>
                                        {extract.questions?.map((q: any, qIdx: number) => (
                                            <Box key={qIdx} pl={2}>
                                                <Text fontSize="sm" fontWeight="bold" color="gray.800">Q: {q.questionText} ({q.questionType})</Text>
                                                <Text fontSize="sm" color="gray.700" mt={1}>Ans: {q.modelAnswer}</Text>
                                            </Box>
                                        ))}
                                    </VStack>
                                ))}
                            </Box>
                        )}

                        {node.cbseCompetencyLongAnswers && node.cbseCompetencyLongAnswers.length > 0 && (
                            <Box border="1px solid" borderColor="blue.100" bg="blue.50" p={4} borderRadius="xl" mt={3}>
                                <Text fontWeight="bold" fontSize="sm" color="blue.800" mb={2}>
                                    📝 High-Order Competency Challenge
                                </Text>
                                {node.cbseCompetencyLongAnswers.map((longAns, lIdx) => (
                                    <VStack key={lIdx} align="stretch" spacing={2}>
                                        <Text fontSize="sm" fontWeight="bold" color="gray.800">{longAns.questionPrompt}</Text>
                                        <Box bg="white" p={3} borderRadius="md" fontSize="sm" color="gray.700">
                                            <Text fontWeight="bold" color="blue.600" fontSize="xs" mb={1}>MODEL TOPPER ANSWER:</Text>
                                            {longAns.modelTopperAnswer}
                                        </Box>
                                    </VStack>
                                ))}
                            </Box>
                        )}
                    </VStack>
                </Box>
            ))}
        </VStack>
    );
};

export default EnglishNotesNarrativeNote;