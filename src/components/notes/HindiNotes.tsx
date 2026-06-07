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
    useColorModeValue
} from "@chakra-ui/react";
import { FaBook, FaPenNib, FaAward, FaGraduationCap, FaLightbulb, FaCheckCircle, FaFileAlt } from "react-icons/fa";

// Updated TabType to include "summary"
type TabType = "summary" | "explanations" | "grammar_vocab" | "questions" | "textbook";

const HindiNotes = () => {
    // Setting "summary" as the default starting tab for better onboarding
    const [activeChapter, setActiveChapter] = useState<string>("");
    const [activeTab, setActiveTab] = useState<TabType>("summary");

    // Semantic Theme Colors for Student Engagement
    const bgGradient = useColorModeValue("linear(to-b, orange.50/30, blue.50/20)", "linear(to-b, gray.900, gray.800)");
    const cardBg = useColorModeValue("white", "gray.800");
    const summaryBg = useColorModeValue("amber.50", "yellow.900/20");
    const summaryBorder = useColorModeValue("amber.200", "yellow.700");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const headingColor = useColorModeValue("slate.800", "white");

    const params = useParams<Record<string, string>>();
    const rawParam = params.type || params.id || "";
    const decodedType = useMemo(() => (rawParam ? decodeURIComponent(rawParam) : ""), [rawParam]);

    // --- Query 1: Fetch Chapter List ---
    const {
        data: dropdownData,
        isLoading: dropdownLoading,
        isError: isDropdownError,
        error: dropdownError
    } = useQuery<any>({
        queryKey: ["chapters", decodedType],
        queryFn: async () => {
            if (!decodedType) throw new Error("Route parameter key is missing.");
            return getChapterList({ key: decodedType });
        },
        enabled: !!decodedType,
        staleTime: Infinity,
    });

    const chapters = useMemo<string[]>(() => {
        if (!dropdownData) return [];
        const target = dropdownData.data ? dropdownData.data : dropdownData;
        if (Array.isArray(target)) return target;
        if (target.lstChapters && Array.isArray(target.lstChapters)) return target.lstChapters;
        if (target.chapters && Array.isArray(target.chapters)) return target.chapters;
        return [];
    }, [dropdownData]);

    useEffect(() => {
        if (chapters.length > 0 && !activeChapter) {
            setActiveChapter(chapters[0]);
        }
    }, [chapters, activeChapter]);

    // --- Query 2: Fetch Notes Payload ---
    const {
        data: contentResponse,
        isFetching: contentLoading,
    } = useQuery<any>({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType, chapter: activeChapter }),
        enabled: !!decodedType && !!activeChapter,
        staleTime: 1000 * 60 * 20,
    });

    const notesList = useMemo<any[]>(() => {
        if (!contentResponse) return [];
        if (contentResponse.notes && Array.isArray(contentResponse.notes)) return contentResponse.notes;
        if (contentResponse.data?.notes && Array.isArray(contentResponse.data.notes)) return contentResponse.data.notes;
        return [];
    }, [contentResponse]);

    const chapterSummary = useMemo<string>(() => {
        if (!contentResponse) return "";
        return contentResponse.summary || contentResponse.data?.summary || "";
    }, [contentResponse]);

    // Map ActiveTab string index to Chakra's number index (Updated to 5 Tabs)
    const tabIndexMap: Record<TabType, number> = { summary: 0, explanations: 1, grammar_vocab: 2, questions: 3, textbook: 4 };
    const tabStringMap: TabType[] = ["summary", "explanations", "grammar_vocab", "questions", "textbook"];

    const filteredContent = useMemo(() => {
        if (!notesList || notesList.length === 0) return [];

        switch (activeTab) {
            case "explanations":
                return notesList.filter(item =>
                    item.nodeType === "narrative_note" &&
                    !item.sectionOrTheme?.includes("शिल्प सौंदर्य") &&
                    !(item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0)
                );
            case "grammar_vocab":
                return notesList.filter(item =>
                    item.sectionOrTheme?.includes("शिल्प सौंदर्य") ||
                    item.sectionOrTheme?.includes("भाषा") ||
                    (item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0)
                );
            case "questions":
                return notesList.filter(item =>
                    (item.cbseExtractBasedQuestions && item.cbseExtractBasedQuestions.length > 0) ||
                    (item.cbseCompetencyLongAnswers && item.cbseCompetencyLongAnswers.length > 0) ||
                    (item.quickCheckMCQs && item.quickCheckMCQs.length > 0)
                );
            case "textbook":
                return notesList.filter(item =>
                    item.nodeType === "textbook_exercise_section" ||
                    (item.fullTextbookSolutions && item.fullTextbookSolutions.length > 0)
                );
            case "summary":
            default:
                return []; // Summary content is handled separately in the tab panel view
        }
    }, [notesList, activeTab]);

    return (
        <Box minH="100vh" bgGradient={bgGradient} py={{ base: 4, md: 8 }} px={{ base: 2, md: 4 }}>
            <Container maxW="container.lg">

                {/* Brand Header */}
                <VStack spacing={2} align="center" mb={{ base: 6, md: 8 }} textAlign="center">
                    <Heading as="h1" size={{ base: "xl", md: "2xl" }} color={headingColor} fontWeight="extrabold" letterSpacing="tight">
                        CBSE हिंदी स्टडी पोर्टल
                    </Heading>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" fontWeight="medium">
                        Class 6 - 12 • स्मार्ट डिजिटल नोट्स
                    </Text>
                </VStack>

                {/* Dropdown Card */}
                <Box bg={cardBg} p={{ base: 4, md: 5 }} borderRadius="2xl" boxShadow="sm" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} mb={6} maxW={{ base: "100%", md: "sm" }}>
                    <Stack spacing={2}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.600">चुनिए पाठ (Select Chapter):</Text>
                        <Select
                            value={activeChapter}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setActiveChapter(e.target.value)}
                            disabled={dropdownLoading || chapters.length === 0}
                            size="lg"
                            borderRadius="xl"
                            fontWeight="medium"
                        >
                            {dropdownLoading && <option>अध्याय लोड हो रहे हैं...</option>}
                            {!dropdownLoading && chapters.length === 0 && <option>कोई अध्याय नहीं मिला</option>}
                            {chapters.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </Select>
                    </Stack>
                </Box>

                {/* Loading & Error States */}
                {isDropdownError && (
                    <Alert status="error" borderRadius="xl" mb={4}>
                        <AlertIcon /> {(dropdownError as Error)?.message}
                    </Alert>
                )}

                {contentLoading && (
                    <Flex justify="center" align="center" direction="column" minH="200px" gap={3}>
                        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
                        <Text fontSize="sm" fontWeight="medium" color="blue.500">पाठ्य सामग्री लोड हो रही है...</Text>
                    </Flex>
                )}

                {/* Main Dashboard Content */}
                {!contentLoading && notesList.length > 0 && (
                    <Stack spacing={6}>

                        {/* Interactive Navigation Tabs with Summary Tab included */}
                        <Box bg={cardBg} borderRadius="2xl" boxShadow="sm" overflow="hidden" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} p={2}>
                            <Tabs
                                isFitted
                                variant="soft-rounded"
                                colorScheme="blue"
                                index={tabIndexMap[activeTab]}
                                onChange={(index) => setActiveTab(tabStringMap[index])}
                            >
                                <TabList
                                    display="flex"
                                    flexWrap="wrap" // Essential for flawless 5-tab alignment on mobile
                                    gap={1}
                                    p={1}
                                >
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 30%", sm: "1" }}><Icon as={FaFileAlt} mr={1.5} display={{ base: "none", sm: "inline" }} />सारांश</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 30%", sm: "1" }}><Icon as={FaBook} mr={1.5} display={{ base: "none", sm: "inline" }} />व्याख्या</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 30%", sm: "1" }}><Icon as={FaPenNib} mr={1.5} display={{ base: "none", sm: "inline" }} />भाषा-शिल्प</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaAward} mr={1.5} display={{ base: "none", sm: "inline" }} />बोर्ड प्रश्न</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} py={{ base: 2, md: 3 }} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaGraduationCap} mr={1.5} display={{ base: "none", sm: "inline" }} />एनसीईआरटी</Tab>
                                </TabList>

                                <TabPanels mt={2}>
                                    <TabPanel p={0}></TabPanel>
                                </TabPanels>
                            </Tabs>

                            {/* Conditional Rendering Area Based on Active Tab */}
                            <Box p={{ base: 2, md: 4 }}>

                                {/* CASE 1: Summary Tab Active */}
                                {activeTab === "summary" && (
                                    <Box bg={summaryBg} border="1px" borderColor={summaryBorder} p={{ base: 4, md: 6 }} borderRadius="xl" boxShadow="xs" mt={2}>
                                        <HStack spacing={2} mb={3}>
                                            <Icon as={FaFileAlt} color="amber.600" boxSize={5} />
                                            <Heading as="h2" size="md" color="amber.900">पाठ का मुख्य सारांश (Chapter Summary)</Heading>
                                        </HStack>
                                        <Text whiteSpace="pre-line" color={textColor} fontSize={{ base: "sm", md: "md" }} lineHeight="tall">
                                            {chapterSummary || "इस अध्याय का सारांश उपलब्ध नहीं है।"}
                                        </Text>
                                    </Box>
                                )}

                                {/* CASE 2: Core Filtered Content List (For Explanations, Grammar, Questions, Textbook) */}
                                {activeTab !== "summary" && (
                                    <Stack spacing={5} mt={2}>
                                        {filteredContent.length > 0 ? (
                                            filteredContent.map((item, idx) => (
                                                <Box key={idx} p={{ base: 4, md: 6 }} borderWidth="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" bg={cardBg} shadow="xs" transition="all 0.2s" _hover={{ shadow: "md" }}>

                                                    {/* Node Header */}
                                                    <Flex justify="between" align="center" wrap="wrap" gap={2} mb={4} borderBottom="1px" pb={3} borderColor={useColorModeValue("gray.100", "gray.700")}>
                                                        <Heading size="sm" maxW={{ base: "70%", md: "80%" }}>{item.sectionOrTheme}</Heading>
                                                        <Badge colorScheme="purple" variant="subtle" px={2.5} py={0.5} borderRadius="md" fontSize="2xs">{item.nodeType}</Badge>
                                                    </Flex>

                                                    <Stack spacing={4}>
                                                        {/* Text Excerpt Quote */}
                                                        {item.analysis?.note && (
                                                            <Box pl={3} borderLeftWidth="4px" borderLeftColor="gray.400" bg={useColorModeValue("gray.50", "gray.900/40")} py={2} pr={2} borderRadius="r-md" fontStyle="italic" fontSize="sm" color="gray.600">
                                                                "{item.analysis.note}"
                                                            </Box>
                                                        )}

                                                        {/* In-depth Explanation */}
                                                        {item.analysis?.explanation && (
                                                            <Text fontSize={{ base: "sm", md: "md" }} lineHeight="relaxed" whiteSpace="pre-line" color={textColor}>
                                                                {item.analysis.explanation}
                                                            </Text>
                                                        )}

                                                        {/* Topper/Examiner Tip */}
                                                        {item.analysis?.criticalAnalysisTip && (
                                                            <HStack spacing={2} p={3} bg="red.50" color="red.900" borderRadius="xl" border="1px" borderColor="red.100" fontSize="xs">
                                                                <Icon as={FaLightbulb} boxSize={4} flexShrink={0} color="red.600" />
                                                                <Text fontWeight="medium"><strong> परीक्षा टिप:</strong> {item.analysis.criticalAnalysisTip}</Text>
                                                            </HStack>
                                                        )}

                                                        {/* Dictionary Vocabulary */}
                                                        {item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0 && (
                                                            <Box mt={2}>
                                                                <Text fontSize="xs" fontWeight="bold" mb={2} color="indigo.600">📌 कठिन शब्दार्थ:</Text>
                                                                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2}>
                                                                    {item.analysis.contextualVocabulary.map((v: any, vIdx: number) => (
                                                                        <HStack key={vIdx} bg="indigo.50/40" p={2} borderRadius="md" border="1px" borderColor="indigo.50" fontSize="xs">
                                                                            <Text fontWeight="bold" color="indigo.900">{v.word}</Text>
                                                                            <Text color="gray.400">:</Text>
                                                                            <Text color="gray.700">{v.meaning}</Text>
                                                                        </HStack>
                                                                    ))}
                                                                </SimpleGrid>
                                                            </Box>
                                                        )}

                                                        {/* Textbook Q&A */}
                                                        {activeTab === "textbook" && item.fullTextbookSolutions && item.fullTextbookSolutions.length > 0 && (
                                                            <Stack spacing={3} mt={2}>
                                                                {item.fullTextbookSolutions.map((sol: any, sIdx: number) => (
                                                                    <Box key={sIdx} p={3} bg="emerald.50/20" border="1px" borderColor="emerald.100/60" borderRadius="xl">
                                                                        <Text fontWeight="bold" fontSize="sm" mb={1} color="gray.900">{sol.questionNumber}. {sol.textbookQuestion}</Text>
                                                                        <Divider my={2} borderColor="emerald.100" />
                                                                        <Text fontSize="sm" pl={2} borderLeftWidth="2px" borderLeftColor="emerald.400" color="gray.700" whiteSpace="pre-line">
                                                                            <strong style={{ color: '#065F46' }}>उत्तर:</strong> {sol.modelAnswer}
                                                                        </Text>
                                                                    </Box>
                                                                ))}
                                                            </Stack>
                                                        )}

                                                        {/* Board Extract Questions */}
                                                        {activeTab === "questions" && item.cbseExtractBasedQuestions && item.cbseExtractBasedQuestions.length > 0 && (
                                                            <Stack spacing={4} mt={2}>
                                                                {item.cbseExtractBasedQuestions.map((ext: any, eIdx: number) => (
                                                                    <Stack key={eIdx} p={3} bg="purple.50/20" border="1px" borderColor="purple.100" borderRadius="xl" spacing={3}>
                                                                        <Text p={2.5} bg="white" borderRadius="md" borderStyle="dashed" borderWidth="1px" fontSize="xs" fontStyle="italic" color="gray.600">
                                                                            {ext.verbatimExcerpt}
                                                                        </Text>
                                                                        {ext.questions?.map((q: any, qIdx: number) => (
                                                                            <Stack key={qIdx} spacing={1} fontSize="xs">
                                                                                <Flex align="center" gap={1.5} wrap="wrap">
                                                                                    <Text fontWeight="bold" color="gray.900">👉 {q.questionText}</Text>
                                                                                    <Badge colorScheme="purple" fontSize="3xs">{q.questionType}</Badge>
                                                                                </Flex>
                                                                                <Text pl={2} color="gray.700"><strong>उत्तर:</strong> {q.modelAnswer}</Text>
                                                                            </Stack>
                                                                        ))}
                                                                    </Stack>
                                                                ))}
                                                            </Stack>
                                                        )}

                                                        {/* Competency Long Questions */}
                                                        {activeTab === "questions" && item.cbseCompetencyLongAnswers && item.cbseCompetencyLongAnswers.length > 0 && (
                                                            <Stack spacing={3} mt={2}>
                                                                {item.cbseCompetencyLongAnswers.map((long: any, lIdx: number) => (
                                                                    <Stack key={lIdx} p={4} bg="sky.50/20" border="1px" borderColor="sky.100" borderRadius="xl" spacing={2}>
                                                                        <Text fontWeight="bold" fontSize="sm" color="gray.900">⚠️ {long.questionPrompt}</Text>
                                                                        {long.markingSchemeCoreValuePoints && (
                                                                            <Text fontSize="3xs" fontWeight="bold" bg="sky.50" p={1.5} borderRadius="md" color="sky.800">
                                                                                की-पॉइंट्स: {long.markingSchemeCoreValuePoints.join(" | ")}
                                                                            </Text>
                                                                        )}
                                                                        <Text fontSize="sm" color="gray.700" whiteSpace="pre-line"><strong>आदर्श उत्तर:</strong> {long.modelTopperAnswer}</Text>
                                                                    </Stack>
                                                                ))}
                                                            </Stack>
                                                        )}

                                                        {/* Quick Check MCQs */}
                                                        {activeTab === "questions" && item.quickCheckMCQs && item.quickCheckMCQs.length > 0 && (
                                                            <Box mt={3} pt={3} borderTopWidth="1px" borderStyle="dashed" borderColor="gray.200">
                                                                <Text fontSize="xs" fontWeight="bold" color="amber.700" mb={2}>🧩 त्वरित वस्तुनिष्ठ प्रश्न (Quick MCQs):</Text>
                                                                <Stack spacing={3}>
                                                                    {item.quickCheckMCQs.map((mcq: any, mIdx: number) => (
                                                                        <Stack key={mIdx} p={3} bg="amber.50/20" border="1px" borderColor="amber.100" borderRadius="xl" spacing={2}>
                                                                            <Text fontWeight="bold" fontSize="xs">प्रश्न: {mcq.question}</Text>
                                                                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={1.5} pl={1}>
                                                                                {mcq.options && Object.entries(mcq.options).map(([key, val]: any) => (
                                                                                    <Text key={key} fontSize="3xs" bg="white" p={1.5} borderRadius="md" border="1px" borderColor="gray.100" color="gray.600">
                                                                                        <strong>({key})</strong> {val}
                                                                                    </Text>
                                                                                ))}
                                                                            </SimpleGrid>
                                                                            <HStack p={1.5} bg="emerald.50" color="emerald.900" borderRadius="md" fontSize="3xs" spacing={1}>
                                                                                <Icon as={FaCheckCircle} color="emerald.600" />
                                                                                <Text><strong>सही विकल्प: ({mcq.correctOption})</strong> — {mcq.explanation}</Text>
                                                                            </HStack>
                                                                        </Stack>
                                                                    ))}
                                                                </Stack>
                                                            </Box>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            ))
                                        ) : (
                                            <Box py={8} px={4} textAlign="center" borderWidth="1px" borderStyle="dashed" borderRadius="xl" color="gray.400" fontSize="sm" bg={cardBg}>
                                                इस केटेगरी में कोई डेटा उपलब्ध नहीं है। कृपया दूसरे टैब पर क्लिक करें।
                                            </Box>
                                        )}
                                    </Stack>
                                )}
                            </Box>
                        </Box>
                    </Stack>
                )}
            </Container>
        </Box>
    );
};

export default HindiNotes;