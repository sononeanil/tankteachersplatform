import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import {
    Box,
    Container,
    Heading,
    Select,
    SimpleGrid,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text,
    Stack,
    Badge,
    Flex,
    Spinner,
    Alert,
    AlertIcon,
    Divider,
    VStack,
    HStack,
    Icon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    ListItem,
    UnorderedList,
    useColorModeValue
} from "@chakra-ui/react";
import {
    FaBookOpen,
    FaPenSquare,
    FaQuestionCircle,
    FaGraduationCap,
    FaFileAlt,
    FaLightbulb,
    FaCheckCircle,
    FaChevronRight
} from "react-icons/fa";

// Updated Tab Types definition including "summary"
type TabType = "summary" | "explanations" | "grammar_vocab" | "questions" | "textbook";

const SanskritNotes = () => {
    // Defaulting to "summary" for a cleaner initial page load
    const [activeChapter, setActiveChapter] = useState<string>("");
    const [activeTab, setActiveTab] = useState<TabType>("summary");

    // Semantic Theme Color Hooks for Traditional yet Modern Scholarly Vibe
    const bgGradient = useColorModeValue("linear(to-b, orange.50/40, red.50/20)", "linear(to-b, gray.900, orange.950/20)");
    const cardBg = useColorModeValue("white", "gray.800");
    const shlokaBg = useColorModeValue("orange.50/60", "orange.900/10");
    const shlokaBorder = useColorModeValue("orange.200", "orange.700");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const headingColor = useColorModeValue("orange.800", "orange.200");

    const params = useParams<Record<string, string>>();
    const rawParam = params.type || params.id || "";
    const decodedType = useMemo(() => (rawParam ? decodeURIComponent(rawParam) : ""), [rawParam]);

    // --- Query 1: Fetch Chapter List ---
    const { data: dropdownData, isLoading: dropdownLoading, isError: isDropdownError, error: dropdownError } = useQuery<any>({
        queryKey: ["chapters", decodedType],
        queryFn: () => {
            if (!decodedType) throw new Error("Route parameter key is missing.");
            return getChapterList({ key: decodedType });
        },
        enabled: !!decodedType,
        staleTime: Infinity,
    });

    const chapters = useMemo<string[]>(() => {
        if (!dropdownData) return [];
        if (Array.isArray(dropdownData)) return dropdownData;
        if (dropdownData.lstChapters && Array.isArray(dropdownData.lstChapters)) return dropdownData.lstChapters;
        if (dropdownData.data?.lstChapters && Array.isArray(dropdownData.data.lstChapters)) return dropdownData.data.lstChapters;
        return [];
    }, [dropdownData]);

    useEffect(() => {
        if (chapters.length > 0 && !activeChapter) {
            setActiveChapter(chapters[0]);
        }
    }, [chapters, activeChapter]);

    // --- Query 2: Fetch Sanskrit Notes Payload ---
    const { data: contentResponse, isFetching: contentLoading } = useQuery<any>({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType, chapter: activeChapter }),
        enabled: !!decodedType && !!activeChapter,
        staleTime: 1000 * 60 * 20,
    });

    // --- Safe Extraction of the Notes Array ---
    const notesList = useMemo<any[]>(() => {
        if (contentResponse?.notes && Array.isArray(contentResponse.notes)) return contentResponse.notes;
        if (contentResponse?.data?.notes && Array.isArray(contentResponse.data.notes)) return contentResponse.data.notes;
        return [];
    }, [contentResponse]);

    // --- Safe Extraction of Chapter Summary ---
    const chapterSummary = useMemo<string>(() => {
        return contentResponse?.notes?.summary || contentResponse?.data?.notes?.summary || contentResponse?.summary || contentResponse?.data?.summary || "";
    }, [contentResponse]);

    // Tab Mapping Strategy for 5 Tabs
    const tabIndexMap: Record<TabType, number> = { summary: 0, explanations: 1, grammar_vocab: 2, questions: 3, textbook: 4 };
    const tabStringMap: TabType[] = ["summary", "explanations", "grammar_vocab", "questions", "textbook"];

    return (
        <Box minH="100vh" bgGradient={bgGradient} py={{ base: 4, md: 8 }} px={{ base: 2, md: 4 }} fontFamily="'Noto Sans', sans-serif">
            <Container maxW="container.lg">

                {/* Brand Header */}
                <VStack spacing={2} align="center" mb={{ base: 6, md: 8 }} textAlign="center">
                    <Heading as="h1" size={{ base: "xl", md: "2xl" }} color={headingColor} fontWeight="extrabold" letterSpacing="tight">
                        संस्कृत अध्ययन केंद्र
                    </Heading>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" fontWeight="medium">
                        Smart Mobile Notes • Module: {decodedType}
                    </Text>
                </VStack>

                {/* Chapter Selector Card */}
                <Box bg={cardBg} p={{ base: 4, md: 5 }} borderRadius="2xl" boxShadow="sm" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} mb={6} maxW={{ base: "100%", md: "sm" }}>
                    <Stack spacing={2}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.600">चुनिए पाठ (Select Chapter):</Text>
                        <Select
                            id="chap-select"
                            value={activeChapter}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setActiveChapter(e.target.value)}
                            disabled={dropdownLoading || chapters.length === 0}
                            size="lg"
                            borderRadius="xl"
                            fontWeight="medium"
                        >
                            {dropdownLoading && <option>अध्याय लोड हो रहे हैं...</option>}
                            {!dropdownLoading && chapters.length === 0 && <option>कोई अध्याय नहीं मिला</option>}
                            {chapters.map((chap, idx) => (
                                <option key={idx} value={chap}>{chap}</option>
                            ))}
                        </Select>
                    </Stack>
                </Box>

                {/* Error handling */}
                {isDropdownError && (
                    <Alert status="error" borderRadius="xl" mb={4}>
                        <AlertIcon /> {(dropdownError as Error)?.message || "Something went wrong fetching dropdown items."}
                    </Alert>
                )}

                {/* Centered Modern Loader */}
                {contentLoading && (
                    <Flex justify="center" align="center" direction="column" minH="250px" gap={3}>
                        <Spinner size="xl" thickness="4px" speed="0.65s" color="orange.500" />
                        <Text fontSize="sm" fontWeight="medium" color="orange.600">पाठ्यसामग्री लोड हो रही है...</Text>
                    </Flex>
                )}

                {/* Content Presentational Layer */}
                {!contentLoading && contentResponse && (
                    <Stack spacing={6}>
                        <Box bg={cardBg} borderRadius="2xl" boxShadow="sm" overflow="hidden" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} p={2}>

                            {/* Navigation Tab Bar Layout */}
                            <Tabs
                                isFitted
                                variant="soft-rounded"
                                colorScheme="orange"
                                index={tabIndexMap[activeTab]}
                                onChange={(index) => setActiveTab(tabStringMap[index])}
                            >
                                <TabList display="flex" flexWrap="wrap" gap={1} p={1}>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 30%", sm: "1" }}><Icon as={FaFileAlt} mr={1.5} display={{ base: "none", sm: "inline" }} />सारांश</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 55%", sm: "1" }}><Icon as={FaBookOpen} mr={1.5} display={{ base: "none", sm: "inline" }} />व्याख्या</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaPenSquare} mr={1.5} display={{ base: "none", sm: "inline" }} />व्याकरण</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaQuestionCircle} mr={1.5} display={{ base: "none", sm: "inline" }} />बोर्ड प्रश्न</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaGraduationCap} mr={1.5} display={{ base: "none", sm: "inline" }} />अभ्यास</Tab>
                                </TabList>
                                <TabPanels mt={2}><TabPanel p={0}></TabPanel></TabPanels>
                            </Tabs>

                            {/* Main Content Area */}
                            <Box p={{ base: 2, md: 4 }}>

                                {/* TAB Area 1: Summary Area */}
                                {activeTab === "summary" && (
                                    <Box bg={useColorModeValue("orange.50/40", "orange.900/10")} border="1px" borderColor={shlokaBorder} p={{ base: 4, md: 6 }} borderRadius="xl" mt={2}>
                                        <HStack spacing={2} mb={3}>
                                            <Icon as={FaFileAlt} color="orange.600" boxSize={5} />
                                            <Heading as="h2" size="md" color={useColorModeValue("orange.900", "orange.100")}>अध्याय सारांश (Summary)</Heading>
                                        </HStack>
                                        <Text whiteSpace="pre-line" color={textColor} fontSize={{ base: "sm", md: "md" }} lineHeight="tall">
                                            {chapterSummary || "इस अध्याय का सारांश उपलब्ध नहीं है।"}
                                        </Text>
                                    </Box>
                                )}

                                {/* TAB Area 2: Explanations (Shlokas / Passages) */}
                                {activeTab === "explanations" && (
                                    <Stack spacing={5} mt={2}>
                                        {notesList.filter(n => n.nodeType === "narrative_note" && n.analysis?.note).map((item, index) => (
                                            <Box key={index} border="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" bg={cardBg} overflow="hidden" shadow="xs">
                                                <Box bg={useColorModeValue("orange.50/70", "orange.900/30")} px={{ base: 4, md: 5 }} py={3} borderBottom="1px" borderColor={useColorModeValue("orange.100", "orange.800")}>
                                                    <Text fontWeight="bold" color="orange.800" fontSize="sm">
                                                        प्रसंग / विषय-वस्तु {index + 1}: {item.sectionOrTheme}
                                                    </Text>
                                                </Box>
                                                <Stack spacing={4} p={{ base: 4, md: 6 }}>
                                                    {/* Sanskrit Shloka Box - Keeps text centered, line-breaks intact, and fully responsive */}
                                                    <Box fontSize={{ base: "md", md: "lg" }} color="gray.800" _dark={{ color: "gray.100" }} textAlign="center" my={2} bg={shlokaBg} p={{ base: 4, md: 5 }} borderRadius="xl" border="1px dashed" borderColor={shlokaBorder} whiteSpace="pre-line" fontWeight={600} lineHeight="1.8">
                                                        {item.analysis.note}
                                                    </Box>

                                                    {item.analysis.anvayaAndBhavarth && (
                                                        <Stack spacing={1}>
                                                            <Text fontWeight="bold" color="gray.600" fontSize="xs" display="flex" align="center"><Icon as={FaChevronRight} boxSize={3} mr={1} />अन्वय और भावार्थ:</Text>
                                                            <Box bg={useColorModeValue("gray.50", "gray.900/30")} p={3} borderRadius="lg" fontSize="sm" lineHeight="relaxed" whiteSpace="pre-line" color={textColor}>
                                                                {item.analysis.anvayaAndBhavarth}
                                                            </Box>
                                                        </Stack>
                                                    )}

                                                    {item.analysis.explanation && (
                                                        <Stack spacing={1}>
                                                            <Text fontWeight="bold" color="gray.600" fontSize="xs" display="flex" align="center"><Icon as={FaChevronRight} boxSize={3} mr={1} />व्याख्या (Explanation):</Text>
                                                            <Text fontSize="sm" lineHeight="relaxed" color={textColor} pl={1}>
                                                                {item.analysis.explanation}
                                                            </Text>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}

                                {/* TAB Area 3: Grammar & Vocabulary */}
                                {activeTab === "grammar_vocab" && (
                                    <Stack spacing={5} mt={2}>
                                        {notesList.filter(n => n.nodeType === "narrative_note").map((item, index) => {
                                            const grammar = item.analysis?.vyakaranGrammar || [];
                                            const vocab = item.analysis?.contextualVocabulary || [];
                                            const tip = item.analysis?.criticalAnalysisTip;

                                            if (grammar.length === 0 && vocab.length === 0) return null;

                                            return (
                                                <Box key={index} border="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" p={{ base: 4, md: 5 }} bg={cardBg}>
                                                    <Heading size="xs" color="blue.800" _dark={{ color: "blue.200" }} borderBottom="1px" pb={2} mb={4} fontWeight="bold">
                                                        📦 व्याकरण विश्लेषण: {item.sectionOrTheme}
                                                    </Heading>

                                                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                                                        {/* Vocabulary Component - Wrapped inside a Table Container for Flawless Mobile Scroll */}
                                                        {vocab.length > 0 && (
                                                            <Stack spacing={2}>
                                                                <Text fontWeight="bold" fontSize="xs" color="gray.600">कठिन शब्दार्थ (Vocabulary)</Text>
                                                                <TableContainer border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} borderRadius="lg">
                                                                    <Table variant="simple" size="sm">
                                                                        <Thead bg={useColorModeValue("gray.50", "gray.900")}>
                                                                            <Tr>
                                                                                <Th>शब्द</Th>
                                                                                <Th>अर्थ</Th>
                                                                            </Tr>
                                                                        </Thead>
                                                                        <Tbody>
                                                                            {vocab.map((v: any, i: number) => (
                                                                                <Tr key={i}>
                                                                                    <Td fontWeight="bold" color="orange.700" _dark={{ color: "orange.300" }} minW="100px" whiteSpace="normal">{v.word}</Td>
                                                                                    <Td whiteSpace="normal">{v.meaning}</Td>
                                                                                </Tr>
                                                                            ))}
                                                                        </Tbody>
                                                                    </Table>
                                                                </TableContainer>
                                                            </Stack>
                                                        )}

                                                        {/* Grammar Breakdowns */}
                                                        {grammar.length > 0 && (
                                                            <Stack spacing={2}>
                                                                <Text fontWeight="bold" fontSize="xs" color="gray.600">व्याकरण / सन्धि / विग्रह</Text>
                                                                <Box p={3} bg={useColorModeValue("gray.50/50", "gray.900/20")} borderRadius="lg" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")}>
                                                                    <UnorderedList spacing={2} marginStart={4} fontSize="sm">
                                                                        {grammar.map((g: string, i: number) => (
                                                                            <ListItem key={i} color={textColor} lineHeight="relaxed">{g}</ListItem>
                                                                        ))}
                                                                    </UnorderedList>
                                                                </Box>
                                                            </Stack>
                                                        )}
                                                    </SimpleGrid>

                                                    {/* Board/Examiner Tips */}
                                                    {tip && (
                                                        <HStack spacing={2} mt={4} p={3} bg="red.50" _dark={{ bg: "red.950/20" }} color={useColorModeValue("red.900", "red.200")} borderRadius="xl" border="1px" borderColor="red.100" fontSize="xs">
                                                            <Icon as={FaLightbulb} boxSize={4} flexShrink={0} color="red.600" />
                                                            <Text fontWeight="medium"><strong>परीक्षा युक्ति (Exam Tip):</strong> {tip}</Text>
                                                        </HStack>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                )}

                                {/* TAB Area 4: Board Questions & Extracts */}
                                {activeTab === "questions" && (
                                    <Stack spacing={5} mt={2}>
                                        {notesList.map((item, idx) => {
                                            const extracts = item.cbseExtractBasedQuestions || [];
                                            const mcqs = item.quickCheckMCQs || [];

                                            if (extracts.length === 0 && mcqs.length === 0) return null;

                                            return (
                                                <Stack key={idx} spacing={4}>
                                                    {/* Extract Context Passages */}
                                                    {extracts.map((ex: any, eIdx: number) => (
                                                        <Box key={eIdx} border="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" p={{ base: 4, md: 5 }} bg={cardBg}>
                                                            <Badge colorScheme="purple" px={2} py={0.5} borderRadius="md" fontSize="3xs" mb={2}>CBSE EXTRACT BASED QUESTION</Badge>
                                                            <Text fontStyle="italic" bg={useColorModeValue("gray.50", "gray.900/40")} p={3} borderLeftWidth="3px" borderLeftColor="purple.400" my={2} fontSize="sm">
                                                                "{ex.verbatimExcerpt}"
                                                            </Text>
                                                            {ex.questions?.map((q: any, qIdx: number) => (
                                                                <Stack key={qIdx} mt={3} spacing={1} fontSize="sm">
                                                                    <Text fontWeight="bold">Q: {q.questionText} <small style={{ color: '#718096' }}>({q.questionType})</small></Text>
                                                                    <Text pl={3} color="emerald.700" _dark={{ color: "emerald.300" }} bg="emerald.50/30" _dark={{ bg: "emerald.950/10" }} p={2} borderRadius="md">
                                                                        ✔ <strong>उत्तर:</strong> {q.modelAnswer}
                                                                    </Text>
                                                                </Stack>
                                                            ))}
                                                        </Box>
                                                    ))}

                                                    {/* Interactive Multiple Choice Questions Grid */}
                                                    {mcqs.map((mcq: any, mIdx: number) => (
                                                        <Box key={mIdx} border="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" p={{ base: 4, md: 5 }} bg={cardBg}>
                                                            <Badge colorScheme="orange" px={2} py={0.5} borderRadius="md" fontSize="3xs" mb={2}>QUICK CHECK MCQ</Badge>
                                                            <Text fontWeight="bold" fontSize="sm" my={2}>{mcq.question}</Text>
                                                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2.5} mt={3}>
                                                                {mcq.options?.map((opt: string, oIdx: number) => {
                                                                    const isCorrect = opt === mcq.answer;
                                                                    return (
                                                                        <HStack
                                                                            key={oIdx}
                                                                            p={3}
                                                                            borderRadius="xl"
                                                                            border="1px solid"
                                                                            borderColor={isCorrect ? "emerald.300" : useColorModeValue("gray.100", "gray.700")}
                                                                            bg={isCorrect ? "emerald.50/40" : useColorModeValue("gray.50/30", "gray.900/10")}
                                                                            color={isCorrect ? "emerald.800" : textColor}
                                                                            _dark={isCorrect ? { bg: "emerald.950/20", color: "emerald.200" } : {}}
                                                                            fontSize="xs"
                                                                            spacing={2}
                                                                        >
                                                                            <Badge variant="solid" colorScheme={isCorrect ? "emerald" : "gray"} borderRadius="full" px={1.5}>{oIdx + 1}</Badge>
                                                                            <Text fontWeight={isCorrect ? "bold" : "normal"}>{opt}</Text>
                                                                            {isCorrect && <Icon as={FaCheckCircle} color="emerald.500" marginLeft="auto" />}
                                                                        </HStack>
                                                                    );
                                                                })}
                                                            </SimpleGrid>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            );
                                        })}
                                    </Stack>
                                )}

                                {/* TAB Area 5: NCERT Exercises Solutions */}
                                {activeTab === "textbook" && (
                                    <Stack spacing={4} mt={2}>
                                        {notesList.filter(n => n.nodeType === "textbook_exercise_section").map((item, index) => (
                                            <Box key={index}>
                                                <Heading size="xs" color="orange.800" _dark={{ color: "orange.200" }} mb={4} display="flex" align="center">
                                                    📝 पाठ्यपुस्तक अभ्यास समाधान (Exercise Solutions)
                                                </Heading>
                                                <Stack spacing={3}>
                                                    {item.fullTextbookSolutions?.map((sol: any, sIdx: number) => (
                                                        <Box key={sIdx} bg={cardBg} border="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" p={{ base: 4, md: 5 }}>
                                                            <Text fontWeight="bold" color="gray.700" _dark={{ color: "gray.300" }} fontSize="sm" mb={2}>
                                                                <Text as="span" color="blue.500" mr={1.5}>{sol.questionNumber}.</Text>{sol.textbookQuestion}
                                                            </Text>
                                                            <Box bg={useColorModeValue("blue.50/20", "blue.950/10")} p={3} borderRadius="lg" fontSize="sm" color={textColor} borderLeftWidth="3px" borderLeftColor="blue.400" lineHeight="relaxed">
                                                                <strong style={{ color: '#2B6CB0' }}>समाधानम्:</strong> {sol.modelAnswer}
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}

                            </Box>
                        </Box>
                    </Stack>
                )}

                {/* Empty State Fallback */}
                {!contentLoading && !contentResponse && (
                    <Box py={12} px={4} textAlign="center" borderWidth="1px" borderStyle="dashed" borderRadius="2xl" color="gray.400" fontSize="sm" bg={cardBg}>
                        अध्याय उपलब्ध नहीं है। कृपया दूसरा अध्याय चुनें।
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default SanskritNotes;