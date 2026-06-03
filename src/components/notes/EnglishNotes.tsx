import { useQuery } from "@tanstack/react-query";
import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import { useParams } from "react-router-dom";
import {
    VStack,
    Select,
    Text,
    Spinner,
    Box,
    Icon,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Heading,
    SimpleGrid,
    List,
    ListItem,
    ListIcon,
    RadioGroup,
    Radio,
    Stack,
    Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaBookOpen, FaLightbulb, FaBookmark, FaRegQuestionCircle, FaLayerGroup } from "react-icons/fa";
import { MdOutlineQuiz, MdOutlineDescription } from "react-icons/md";

// --- Types & Interfaces ---
interface ChapterResponse {
    lstChapters: string[];
    message: string;
}

interface VocabularyItem {
    word: string;
    meaning: string;
}

interface NoteSection {
    sectionOrTheme: string;
    explanation: string;
    literaryDevices?: string[]; // Made optional
    contextualVocabulary?: VocabularyItem[]; // Made optional
    criticalAnalysisTip?: string; // Made optional
}

interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

interface VennDiagramData {
    conceptA: string;
    conceptB: string;
    uniqueA: string[];
    uniqueB: string[];
    common: string[];
}

interface NotePayload {
    notes: NoteSection[];
    summary: string;
    questions?: QuizQuestion[]; // Made optional
    mindMap?: string; // Made optional
    vennDiagram?: VennDiagramData; // Made optional
}

interface ApiContentResponse {
    notes: NotePayload;
    message: string;
}

const EnglishNotes = () => {
    const [activeChapter, setActiveChapter] = useState<string>("");
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

    const { type } = useParams<{ type: string }>();
    const decodedType = type ? decodeURIComponent(type) : null;

    // --- Query 1: Fetch Chapter Dropdown List ---
    const { data: dropdownData, isLoading: dropdownLoading, isError: dropdownError } = useQuery<ChapterResponse>({
        queryKey: ["chapters", decodedType],
        queryFn: () => getChapterList({ key: decodedType! }),
        enabled: !!decodedType,
        staleTime: Infinity,
    });

    const chapters: string[] =
        dropdownData?.lstChapters ||
        (dropdownData as any)?.data?.lstChapters ||
        (Array.isArray(dropdownData) ? dropdownData : []);

    // --- Query 2: Fetch Notes Payload ---
    const { data: contentResponse, isFetching: contentLoading } = useQuery<ApiContentResponse>({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType!, chapter: activeChapter }),
        enabled: !!decodedType && !!activeChapter,
        staleTime: 1000 * 60 * 20,
    });

    // const chapterData = contentResponse?.notes;
    const chapterData = contentResponse;

    const handleAnswerChange = (questionIndex: number, value: string) => {
        setQuizAnswers(prev => ({ ...prev, [questionIndex]: value }));
    };

    return (
        <VStack w="full" maxW="4xl" mx="auto" p={6} spacing={6} align="stretch">
            {/* Title Header */}
            <Text
                fontSize="2xl"
                fontWeight="extrabold"
                bgGradient="linear(to-r, blue.500, purple.600)"
                bgClip="text"
                alignSelf="center"
            >
                📚 Student Learning Dashboard
            </Text>

            {/* Glowing Dropdown Selection */}
            <Box
                position="relative"
                borderRadius="2xl"
                p="3px"
                bgGradient="linear(to-r, blue.400, purple.400, pink.400)"
                boxShadow="0px 10px 20px rgba(102, 126, 234, 0.1)"
            >
                <Select
                    placeholder="Select a chapter to populate summary & quiz..."
                    value={activeChapter}
                    onChange={(e) => {
                        setActiveChapter(e.target.value);
                        setQuizAnswers({});
                    }}
                    disabled={dropdownLoading || dropdownError}
                    bg="white"
                    border="none"
                    borderRadius="xl"
                    height="54px"
                    fontWeight="semibold"
                    color="gray.700"
                    cursor="pointer"
                    icon={<Icon as={FaBookOpen} color="purple.500" w={5} h={5} />}
                >
                    {chapters.map((chapter) => (
                        <option key={chapter} value={chapter}>
                            ✨ {chapter}
                        </option>
                    ))}
                </Select>
            </Box>

            {/* Loading States */}
            {dropdownLoading && (
                <VStack py={4}>
                    <Spinner size="lg" color="purple.500" thickness="4px" />
                    <Text fontSize="sm" color="gray.500">Loading chapters list...</Text>
                </VStack>
            )}

            {contentLoading && (
                <VStack py={12}>
                    <Spinner size="xl" color="pink.500" thickness="4px" speed="0.7s" />
                    <Text fontSize="md" color="purple.600" fontWeight="bold">
                        Building revision maps, flashcards, and quizzes for you... 🚀
                    </Text>
                </VStack>
            )}

            {/* --- Main Dashboard Content Render --- */}
            {chapterData && !contentLoading && (
                <Tabs variant="enclosed" colorScheme="purple" isLazy mt={2}>
                    <TabList borderBottomWidth="2px" overflowX="auto" overflowY="hidden" whiteSpace="nowrap">
                        <Tab fontWeight="bold" gap={2}><Icon as={MdOutlineDescription} /> Detailed Notes</Tab>
                        <Tab fontWeight="bold" gap={2}><Icon as={FaLayerGroup} /> Analysis Matrix</Tab>
                        <Tab fontWeight="bold" gap={2}><Icon as={MdOutlineQuiz} /> Self-Assessment Quiz</Tab>
                    </TabList>

                    <TabPanels>
                        {/* TAB 1: DETAILED THEMES & EXPLANATIONS */}
                        <TabPanel px={0} py={6}>
                            {chapterData.summary && (
                                <Box bg="blue.50" p={5} borderRadius="2xl" mb={6} borderLeft="5px solid" borderColor="blue.400">
                                    <Heading size="sm" color="blue.800" mb={2}>Chapter Overview</Heading>
                                    <Text fontSize="md" color="gray.700" lineHeight="tall" whiteSpace="pre-wrap">
                                        {chapterData.summary}
                                    </Text>
                                </Box>
                            )}

                            <VStack spacing={6} align="stretch">
                                {Array.isArray(chapterData.notes) && chapterData.notes.map((item, index) => (
                                    <Box
                                        key={index}
                                        p={6}
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                        borderRadius="2xl"
                                        boxShadow="sm"
                                        bg="white"
                                    >
                                        <Heading size="md" color="purple.700" mb={3}>
                                            {item.sectionOrTheme}
                                        </Heading>

                                        <Text color="gray.700" fontSize="md" mb={4} lineHeight="relaxed">
                                            {item.explanation}
                                        </Text>

                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={2}>
                                            {/* Vocabulary Safeguard */}
                                            {Array.isArray(item.contextualVocabulary) && item.contextualVocabulary.length > 0 && (
                                                <Box bg="gray.50" p={4} borderRadius="xl">
                                                    <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={2}>🔍 Contextual Vocabulary</Text>
                                                    <List spacing={2}>
                                                        {item.contextualVocabulary.map((v, vIdx) => (
                                                            <ListItem key={vIdx} fontSize="sm">
                                                                <Text as="span" fontWeight="bold" color="purple.600">{v.word}</Text>: {v.meaning}
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}

                                            {/* Literary Devices Safeguard */}
                                            {Array.isArray(item.literaryDevices) && item.literaryDevices.length > 0 && (
                                                <Box bg="purple.50" p={4} borderRadius="xl">
                                                    <Text fontWeight="bold" fontSize="sm" color="purple.700" mb={2}>✨ Literary Elements</Text>
                                                    <List spacing={1}>
                                                        {item.literaryDevices.map((device, dIdx) => (
                                                            <ListItem key={dIdx} fontSize="sm" color="gray.700">
                                                                <ListIcon as={FaBookmark} color="purple.400" />
                                                                {device}
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}
                                        </SimpleGrid>

                                        {item.criticalAnalysisTip && (
                                            <Box bg="#FFFDF5" border="1px solid" borderColor="amber.200" p={3} borderRadius="xl" mt={4} display="flex" gap={2}>
                                                <Icon as={FaLightbulb} color="amber.500" mt={1} />
                                                <Text fontSize="sm" color="amber.900" fontStyle="italic">
                                                    <strong style={{ color: '#B45309' }}>Analysis Pointer:</strong> {item.criticalAnalysisTip}
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </VStack>
                        </TabPanel>

                        {/* TAB 2: ANALYSIS MATRIX */}
                        <TabPanel px={0} py={6}>
                            {chapterData.vennDiagram && (
                                <Box bg="white" borderWidth="1px" borderColor="gray.200" p={6} borderRadius="2xl" boxShadow="sm">
                                    <Heading size="md" textAlign="center" mb={6} color="gray.800">
                                        ⚖️ Comparative Study Matrix
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                        <Box p={4} bg="blue.50" borderRadius="xl">
                                            <Heading size="xs" color="blue.700" mb={3} textAlign="center">
                                                Only in {chapterData.vennDiagram.conceptA}
                                            </Heading>
                                            <List spacing={2}>
                                                {Array.isArray(chapterData.vennDiagram.uniqueA) && chapterData.vennDiagram.uniqueA.map((text, idx) => (
                                                    <ListItem key={idx} fontSize="sm" color="gray.700">• {text}</ListItem>
                                                ))}
                                            </List>
                                        </Box>

                                        <Box p={4} bg="purple.50" borderRadius="xl" border="2px dashed" borderColor="purple.200">
                                            <Heading size="xs" color="purple.700" mb={3} textAlign="center">
                                                🔄 Shared Themes / Overlap
                                            </Heading>
                                            <List spacing={2}>
                                                {Array.isArray(chapterData.vennDiagram.common) && chapterData.vennDiagram.common.map((text, idx) => (
                                                    <ListItem key={idx} fontSize="sm" color="gray.700" fontWeight="medium">• {text}</ListItem>
                                                ))}
                                            </List>
                                        </Box>

                                        <Box p={4} bg="pink.50" borderRadius="xl">
                                            <Heading size="xs" color="pink.700" mb={3} textAlign="center">
                                                Only in {chapterData.vennDiagram.conceptB}
                                            </Heading>
                                            <List spacing={2}>
                                                {Array.isArray(chapterData.vennDiagram.uniqueB) && chapterData.vennDiagram.uniqueB.map((text, idx) => (
                                                    <ListItem key={idx} fontSize="sm" color="gray.700">• {text}</ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </SimpleGrid>
                                </Box>
                            )}

                            {chapterData.mindMap && (
                                <Box mt={6} p={5} bg="gray.900" borderRadius="2xl" color="gray.100">
                                    <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={2} letterSpacing="wider">
                                        🧠 LOGICAL CHAPTER ROADMAP ARCHITECTURE:
                                    </Text>
                                    <pre style={{ fontFamily: "monospace", fontSize: "12px", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                                        {chapterData.mindMap}
                                    </pre>
                                </Box>
                            )}
                        </TabPanel>

                        {/* TAB 3: SELF-ASSESSMENT QUIZ */}
                        <TabPanel px={0} py={6}>
                            <VStack spacing={5} align="stretch">
                                {Array.isArray(chapterData.questions) && chapterData.questions.length > 0 ? (
                                    chapterData.questions.map((q, qIdx) => {
                                        const selectedOptionChar = quizAnswers[qIdx];
                                        const isAnswered = !!selectedOptionChar;
                                        const isCorrect = selectedOptionChar === q.answer;

                                        return (
                                            <Box
                                                key={qIdx}
                                                p={5}
                                                borderWidth="1px"
                                                borderColor={isAnswered ? (isCorrect ? "green.200" : "red.200") : "gray.200"}
                                                bg={isAnswered ? (isCorrect ? "green.50" : "red.50") : "white"}
                                                borderRadius="2xl"
                                                transition="all 0.2s"
                                            >
                                                <Text fontWeight="bold" fontSize="md" mb={3} display="flex" gap={2}>
                                                    <Icon as={FaRegQuestionCircle} mt={1} color="purple.500" />
                                                    {qIdx + 1}. {q.question}
                                                </Text>

                                                <RadioGroup
                                                    onChange={(val) => handleAnswerChange(qIdx, val)}
                                                    value={selectedOptionChar}
                                                    isDisabled={isAnswered}
                                                >
                                                    <Stack spacing={2.5}>
                                                        {/* Options Array Safeguard */}
                                                        {Array.isArray(q.options) && q.options.map((opt) => {
                                                            const optChar = opt.trim().charAt(0);
                                                            return (
                                                                <Radio key={opt} value={optChar} colorScheme="purple">
                                                                    <Text fontSize="sm" color="gray.700">{opt}</Text>
                                                                </Radio>
                                                            );
                                                        })}
                                                    </Stack>
                                                </RadioGroup>

                                                {isAnswered && (
                                                    <Box mt={3} pt={2} borderTop="1px solid" borderColor={isCorrect ? "green.100" : "red.100"}>
                                                        {isCorrect ? (
                                                            <Badge colorScheme="green" p={1.5} borderRadius="md">
                                                                Correct Answer! Choice {q.answer} is right.
                                                            </Badge>
                                                        ) : (
                                                            <VStack align="start" spacing={1}>
                                                                <Badge colorScheme="red" p={1.5} borderRadius="md">
                                                                    Incorrect Evaluation
                                                                </Badge>
                                                                <Text fontSize="xs" color="gray.600" ml={1}>
                                                                    Your Choice: <strong>{selectedOptionChar}</strong> | Correct Key: <strong style={{ color: 'green' }}>{q.answer}</strong>
                                                                </Text>
                                                            </VStack>
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Box p={6} bg="gray.50" borderRadius="xl" textAlign="center">
                                        <Text color="gray.500">No review questions available for this chapter.</Text>
                                    </Box>
                                )}
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            )}
        </VStack>
    );
};

export default EnglishNotes;