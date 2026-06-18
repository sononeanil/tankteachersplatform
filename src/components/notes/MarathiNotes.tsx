import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import type { ChangeEvent } from "react";
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

    Tab,

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
    Button,
    useColorModeValue,
    Tag,
    TagLabel,
    OrderedList,
    ListItem
} from "@chakra-ui/react";
import { FaBook, FaPenNib, FaAward, FaGraduationCap, FaLightbulb, FaCheckCircle, FaTimesCircle, FaFileAlt, FaCommentDots } from "react-icons/fa";

type TabType = "summary" | "explanations" | "grammar_vocab" | "questions" | "competency_questions" | "textbook";

const MarathiNotes = () => {
    const [activeChapter, setActiveChapter] = useState<string>("");
    const [activeTab, setActiveTab] = useState<TabType>("summary");

    // Interactive state for MCQs: stores { [mcqId]: chosenOptionKey }
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

    // Refactored Color Tokens (Using standard Chakra scales)
    const bgGradient = useColorModeValue("linear(to-b, orange.50/40, blue.50/30)", "linear(to-b, gray.900, gray.800)");
    const cardBg = useColorModeValue("white", "gray.800");
    const summaryBg = useColorModeValue("yellow.50", "yellow.900/10");
    const summaryBorder = useColorModeValue("yellow.200", "yellow.700/50");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const headingColor = useColorModeValue("gray.800", "white");

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

    // Reset user question choices whenever chapter transitions occur
    useEffect(() => {
        setSelectedAnswers({});
    }, [activeChapter]);

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

    const tabIndexMap: Record<TabType, number> = {
        summary: 0,
        explanations: 1,
        grammar_vocab: 2,
        questions: 3,
        competency_questions: 4,
        textbook: 5
    };

    const tabStringMap: TabType[] = ["summary", "explanations", "grammar_vocab", "questions", "competency_questions", "textbook"];

    const filteredContent = useMemo(() => {
        if (!notesList || notesList.length === 0) return [];

        switch (activeTab) {
            case "explanations":
                return notesList.filter(item =>
                    item.nodeType === "narrative_note" &&
                    !item.sectionOrTheme?.includes("काव्य सौंदर्य") &&
                    !item.sectionOrTheme?.includes("व्याकरण") &&
                    !(item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0)
                );
            case "grammar_vocab":
                return notesList.filter(item =>
                    item.sectionOrTheme?.includes("काव्य सौंदर्य") ||
                    item.sectionOrTheme?.includes("व्याकरण") ||
                    item.sectionOrTheme?.includes("भाषा अभ्यास") ||
                    (item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0)
                );
            case "questions":
                return notesList.filter(item =>
                    (item.cbseExtractBasedQuestions && item.cbseExtractBasedQuestions.length > 0) ||
                    (item.quickCheckMCQs && item.quickCheckMCQs.length > 0)
                );
            case "competency_questions":
                return notesList.filter(item =>
                    (item.msbshseCompetencyLongAnswers && item.msbshseCompetencyLongAnswers.length > 0) ||
                    (item.cbseCompetencyLongAnswers && item.cbseCompetencyLongAnswers.length > 0)
                );
            case "textbook":
                return notesList.filter(item =>
                    item.nodeType === "textbook_exercise_section" ||
                    (item.fullTextbookSolutions && item.fullTextbookSolutions.length > 0)
                );
            case "summary":
            default:
                return [];
        }
    }, [notesList, activeTab]);

    const handleSelectOption = (mcqIdx: number, optionKey: string) => {
        setSelectedAnswers(prev => ({ ...prev, [mcqIdx]: optionKey }));
    };

    return (
        <Box minH="100vh" bgGradient={bgGradient} py={{ base: 6, md: 10 }} px={{ base: 3, md: 6 }}>
            <Container maxW="container.lg">

                {/* Brand Header updated for Maharashtra Board */}
                <VStack spacing={2} align="center" mb={{ base: 6, md: 10 }} textAlign="center">
                    <Heading as="h1" size={{ base: "xl", md: "2xl" }} color={headingColor} fontWeight="extrabold" letterSpacing="tight">
                        महाराष्ट्र राज्य बोर्ड मराठी अभ्यास पोर्टल
                    </Heading>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.500" fontWeight="medium">
                        इयत्ता ६ वी ते १२ वी • स्मार्ट digital नोट्स व स्वाध्याय
                    </Text>
                </VStack>

                {/* Dropdown Card */}
                <Box bg={cardBg} p={{ base: 4, md: 5 }} borderRadius="2xl" boxShadow="sm" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} mb={6} maxW={{ base: "100%", md: "sm" }}>
                    <Stack spacing={2}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.600">पाठ निवडा (Select Chapter):</Text>
                        <Select
                            value={activeChapter}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setActiveChapter(e.target.value)}
                            disabled={dropdownLoading || chapters.length === 0}
                            size="lg"
                            borderRadius="xl"
                            fontWeight="medium"
                        >
                            {dropdownLoading && <option>धडे लोड होत आहेत...</option>}
                            {!dropdownLoading && chapters.length === 0 && <option>कोणताही धडा आढळला नाही</option>}
                            {chapters.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </Select>
                    </Stack>
                </Box>

                {isDropdownError && (
                    <Alert status="error" borderRadius="xl" mb={4}>
                        <AlertIcon /> {(dropdownError as Error)?.message}
                    </Alert>
                )}

                {contentLoading && (
                    <Flex justify="center" align="center" direction="column" minH="250px" gap={3}>
                        <Spinner size="xl" thickness="4px" speed="0.65s" color="orange.500" />
                        <Text fontSize="sm" fontWeight="medium" color="orange.500">अभ्यास साहित्य लोड होत आहे...</Text>
                    </Flex>
                )}

                {!contentLoading && notesList.length > 0 && (
                    <Stack spacing={6}>

                        {/* Navigation Tabs */}
                        <Box bg={cardBg} borderRadius="2xl" boxShadow="sm" overflow="hidden" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} p={2}>
                            <Tabs
                                isFitted
                                variant="soft-rounded"
                                colorScheme="orange"
                                index={tabIndexMap[activeTab]}
                                onChange={(index) => setActiveTab(tabStringMap[index])}
                            >
                                <TabList display="flex" flexWrap="wrap" gap={1} p={1}>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 30%", sm: "1" }}><Icon as={FaFileAlt} mr={1.5} display={{ base: "none", sm: "inline" }} />सारांश</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 30%", sm: "1" }}><Icon as={FaBook} mr={1.5} display={{ base: "none", sm: "inline" }} />स्पष्टीकरण</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 30%", sm: "1" }}><Icon as={FaPenNib} mr={1.5} display={{ base: "none", sm: "inline" }} />व्याकरण-शिल्प</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaAward} mr={1.5} display={{ base: "none", sm: "inline" }} />महत्त्वाचे प्रश्न</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaCommentDots} mr={1.5} display={{ base: "none", sm: "inline" }} />अभिव्यक्ती व दीर्घोत्तरी</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaGraduationCap} mr={1.5} display={{ base: "none", sm: "inline" }} />पाठ्यपुस्तक स्वाध्याय</Tab>
                                </TabList>
                            </Tabs>

                            <Box p={{ base: 2, md: 4 }}>
                                {/* CASE 1: Summary */}
                                {activeTab === "summary" && (
                                    <Box bg={summaryBg} border="1px" borderColor={summaryBorder} p={{ base: 5, md: 8 }} borderRadius="xl" mt={2}>
                                        <HStack spacing={2} mb={4}>
                                            <Icon as={FaFileAlt} color="orange.600" boxSize={5} />
                                            <Heading as="h2" size="md" color="orange.900">पाठाचा मुख्य सारांश (Chapter Summary)</Heading>
                                        </HStack>
                                        <Text whiteSpace="pre-line" color={textColor} fontSize={{ base: "sm", md: "md" }} lineHeight="tall">
                                            {chapterSummary || "या पाठाचा सारांश उपलब्ध नाही."}
                                        </Text>
                                    </Box>
                                )}

                                {/* CASE 2: Dynamic Categorized Lists */}
                                {activeTab !== "summary" && (
                                    <Stack spacing={5} mt={2}>
                                        {filteredContent.length > 0 ? (
                                            filteredContent.map((item, idx) => (
                                                <Box key={idx} p={{ base: 4, md: 6 }} borderWidth="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" bg={cardBg} shadow="xs">

                                                    {/* Node Header */}
                                                    <Flex justify="space-between" align="center" wrap="wrap" gap={2} mb={4} borderBottom="1px" pb={3} borderColor={useColorModeValue("gray.100", "gray.700")}>
                                                        <Heading size="sm" color="blue.600" maxW={{ base: "70%", md: "80%" }}>{item.sectionOrTheme || "विभाग संदर्भ"}</Heading>
                                                        <Badge colorScheme="blue" variant="subtle" px={2.5} py={0.5} borderRadius="md" fontSize="xs">{item.nodeType}</Badge>
                                                    </Flex>

                                                    <Stack spacing={4}>
                                                        {item.analysis?.note && (
                                                            <Box pl={3} borderLeftWidth="4px" borderLeftColor="orange.400" bg={useColorModeValue("orange.50/40", "gray.700/30")} py={2} pr={2} borderRadius="r-md" fontStyle="italic" fontSize="sm" color="gray.600">
                                                                "{item.analysis.note}"
                                                            </Box>
                                                        )}

                                                        {item.analysis?.explanation && (
                                                            <Text fontSize={{ base: "sm", md: "md" }} lineHeight="relaxed" whiteSpace="pre-line" color={textColor}>
                                                                {item.analysis.explanation}
                                                            </Text>
                                                        )}

                                                        {item.analysis?.criticalAnalysisTip && (
                                                            <HStack spacing={2} p={3} bg="red.50" color="red.900" borderRadius="xl" border="1px" borderColor="red.100" fontSize="sm">
                                                                <Icon as={FaLightbulb} boxSize={4} flexShrink={0} color="red.600" />
                                                                <Text fontWeight="medium"><strong>अभ्यास टीप:</strong> {item.analysis.criticalAnalysisTip}</Text>
                                                            </HStack>
                                                        )}

                                                        {/* Contextual Vocabulary */}
                                                        {item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0 && (
                                                            <Box mt={2}>
                                                                <Text fontSize="sm" fontWeight="bold" mb={3} color="purple.600">📌 कठीण शब्द आणि अर्थ (Keywords):</Text>
                                                                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                                                                    {item.analysis.contextualVocabulary.map((v: any, vIdx: number) => (
                                                                        <HStack key={vIdx} p={3} bg={useColorModeValue("purple.50/50", "purple.900/10")} borderRadius="xl" border="1px" borderColor={useColorModeValue("purple.100", "purple.900/40")} justify="space-between">
                                                                            <Tag size="md" colorScheme="purple" variant="solid" borderRadius="lg">
                                                                                <TagLabel fontWeight="bold">{v.word}</TagLabel>
                                                                            </Tag>
                                                                            <Text color={textColor} fontSize="sm" textAlign="right">{v.meaning}</Text>
                                                                        </HStack>
                                                                    ))}
                                                                </SimpleGrid>
                                                            </Box>
                                                        )}

                                                        {/* Swadhyay Textbook Section */}
                                                        {activeTab === "textbook" && item.fullTextbookSolutions && item.fullTextbookSolutions.length > 0 && (
                                                            <Stack spacing={3} mt={2}>
                                                                {item.fullTextbookSolutions.map((sol: any, sIdx: number) => (
                                                                    <Box key={sIdx} p={4} bg={useColorModeValue("teal.50/30", "teal.900/10")} border="1px" borderColor={useColorModeValue("teal.100", "teal.900/40")} borderRadius="xl">
                                                                        {/* UPDATED: Added a Flex container to show Question and Vibrant Marks Tag */}
                                                                        <Flex justify="space-between" align="start" gap={2} mb={1}>
                                                                            <Text fontWeight="bold" fontSize="sm" color={headingColor}>
                                                                                {sol.questionNumber}. {sol.textbookQuestion}
                                                                            </Text>
                                                                            {sol.marks && (
                                                                                <Badge
                                                                                    colorScheme="orange"
                                                                                    variant="solid"
                                                                                    px={3}
                                                                                    py={1}
                                                                                    borderRadius="full"
                                                                                    fontSize="xs"
                                                                                    fontWeight="bold"
                                                                                    flexShrink={0}
                                                                                    boxShadow="0px 2px 4px rgba(237, 137, 54, 0.3)"
                                                                                >
                                                                                    {sol.marks}
                                                                                </Badge>
                                                                            )}
                                                                        </Flex>
                                                                        <Divider my={2} />
                                                                        <Text fontSize="sm" pl={2} borderLeftWidth="2px" borderLeftColor="teal.400" color={textColor} whiteSpace="pre-line">
                                                                            <strong style={{ color: '#0D9488' }}>उत्तर:</strong> {sol.modelAnswer}
                                                                        </Text>
                                                                    </Box>
                                                                ))}
                                                            </Stack>
                                                        )}

                                                        {/* Board Extracts & Questions */}
                                                        {activeTab === "questions" && item.cbseExtractBasedQuestions && item.cbseExtractBasedQuestions.length > 0 && (
                                                            <Stack spacing={4} mt={2}>
                                                                {item.cbseExtractBasedQuestions.map((ext: any, eIdx: number) => (
                                                                    <Stack key={eIdx} p={3} bg="blue.50/20" border="1px" borderColor="blue.100" borderRadius="xl" spacing={3}>
                                                                        <Text p={2.5} bg={cardBg} borderRadius="md" borderStyle="dashed" borderWidth="1px" fontSize="sm" fontStyle="italic" color="gray.600">
                                                                            {ext.verbatimExcerpt}
                                                                        </Text>
                                                                        {ext.questions?.map((q: any, qIdx: number) => (
                                                                            <Stack key={qIdx} spacing={1} fontSize="sm">
                                                                                <Flex align="center" gap={1.5} wrap="wrap">
                                                                                    <Text fontWeight="bold">👉 {q.questionText}</Text>
                                                                                    <Badge colorScheme="blue" fontSize="2xs">{q.questionType}</Badge>
                                                                                </Flex>
                                                                                <Text pl={2} color={textColor}><strong>उत्तर:</strong> {q.modelAnswer}</Text>
                                                                            </Stack>
                                                                        ))}
                                                                    </Stack>
                                                                ))}
                                                            </Stack>
                                                        )}

                                                        {/* Competency & Long Answers Tab Content Block */}
                                                        {activeTab === "competency_questions" && (
                                                            <Stack spacing={4} mt={2}>
                                                                {/* Render MSBSHSE Competency Questions */}
                                                                {item.msbshseCompetencyLongAnswers && item.msbshseCompetencyLongAnswers.length > 0 && (
                                                                    <Stack spacing={3}>
                                                                        {item.msbshseCompetencyLongAnswers.map((long: any, lIdx: number) => (
                                                                            <Stack key={`msbshse-${lIdx}`} p={4} bg="orange.50/20" border="1px" borderColor="orange.100" borderRadius="xl" spacing={3}>
                                                                                <Flex justify="space-between" align="start">
                                                                                    <Text fontWeight="bold" fontSize="sm">💬 {long.questionPrompt}</Text>
                                                                                    {/* UPDATED: Enhanced the existing badge to make it vibrant solid orange */}
                                                                                    {long.marks && (
                                                                                        <Badge
                                                                                            colorScheme="orange"
                                                                                            variant="solid"
                                                                                            px={3}
                                                                                            py={1}
                                                                                            borderRadius="full"
                                                                                            fontSize="xs"
                                                                                            fontWeight="bold"
                                                                                            ml={2}
                                                                                            flexShrink={0}
                                                                                            boxShadow="0px 2px 4px rgba(237, 137, 54, 0.3)"
                                                                                        >
                                                                                            {long.marks}
                                                                                        </Badge>
                                                                                    )}
                                                                                </Flex>

                                                                                {long.markingSchemeCoreValuePoints && long.markingSchemeCoreValuePoints.length > 0 && (
                                                                                    <Box bg="orange.50" p={3} borderRadius="xl" border="1px" borderColor="orange.100">
                                                                                        <Text fontSize="xs" fontWeight="bold" color="orange.800" mb={2}>
                                                                                            📌 गुणदान योजना (Marking Scheme Core Points):
                                                                                        </Text>
                                                                                        <OrderedList spacing={1.5} pl={4}>
                                                                                            {long.markingSchemeCoreValuePoints.map((point: string, pIdx: number) => (
                                                                                                <ListItem key={pIdx} fontSize="xs" fontWeight="medium" color="orange.900">
                                                                                                    {point.replace(/^[०-९१२३४५६७८९].\s*/, '')}
                                                                                                </ListItem>
                                                                                            ))}
                                                                                        </OrderedList>
                                                                                    </Box>
                                                                                )}

                                                                                <Text fontSize="sm" color={textColor} whiteSpace="pre-line"><strong>उत्तर:</strong> {long.modelTopperAnswer}</Text>
                                                                            </Stack>
                                                                        ))}
                                                                    </Stack>
                                                                )}

                                                                {/* Fallback to render CBSE Competency Questions */}
                                                                {item.cbseCompetencyLongAnswers && item.cbseCompetencyLongAnswers.length > 0 && (
                                                                    <Stack spacing={3}>
                                                                        {item.cbseCompetencyLongAnswers.map((long: any, lIdx: number) => (
                                                                            <Stack key={`cbse-${lIdx}`} p={4} bg="cyan.50/20" border="1px" borderColor="cyan.100" borderRadius="xl" spacing={3}>
                                                                                <Text fontWeight="bold" fontSize="sm">💬 {long.questionPrompt}</Text>

                                                                                {long.markingSchemeCoreValuePoints && long.markingSchemeCoreValuePoints.length > 0 && (
                                                                                    <Box bg="cyan.50" p={3} borderRadius="xl" border="1px" borderColor="cyan.100">
                                                                                        <Text fontSize="xs" fontWeight="bold" color="cyan.800" mb={2}>
                                                                                            📌 महत्त्वाचे मुद्दे (Key Points):
                                                                                        </Text>
                                                                                        <OrderedList spacing={1.5} pl={4}>
                                                                                            {long.markingSchemeCoreValuePoints.map((point: string, pIdx: number) => (
                                                                                                <ListItem key={pIdx} fontSize="xs" fontWeight="bold" color="cyan.900">
                                                                                                    {point.replace(/^[०-९१२३४५६७८९].\s*/, '')}
                                                                                                </ListItem>
                                                                                            ))}
                                                                                        </OrderedList>
                                                                                    </Box>
                                                                                )}

                                                                                <Text fontSize="sm" color={textColor} whiteSpace="pre-line"><strong>उत्कृष्ट उत्तर:</strong> {long.modelTopperAnswer}</Text>
                                                                            </Stack>
                                                                        ))}
                                                                    </Stack>
                                                                )}
                                                            </Stack>
                                                        )}

                                                        {/* Interactive Quick Check MCQs */}
                                                        {activeTab === "questions" && item.quickCheckMCQs && item.quickCheckMCQs.length > 0 && (
                                                            <Box mt={3} pt={3} borderTopWidth="1px" borderStyle="dashed" borderColor="gray.200">
                                                                <Text fontSize="sm" fontWeight="bold" color="orange.700" mb={3}>🧩 ऑनलाईन सराव चाचणी (Interactive MCQs):</Text>
                                                                <Stack spacing={4}>
                                                                    {item.quickCheckMCQs.map((mcq: any, mIdx: number) => {
                                                                        const questionKey = `${idx}-${mIdx}`;
                                                                        const currentSelection = selectedAnswers[questionKey];
                                                                        const isCorrect = currentSelection === mcq.correctOption;

                                                                        return (
                                                                            <Stack key={mIdx} p={4} bg={useColorModeValue("orange.50/10", "gray.700/20")} border="1px" borderColor={useColorModeValue("orange.100", "gray.700")} borderRadius="xl" spacing={3}>
                                                                                <Text fontWeight="bold" fontSize="sm">प्रश्न. {mcq.question}</Text>

                                                                                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2}>
                                                                                    {mcq.options && Object.entries(mcq.options).map(([key, val]: any) => {
                                                                                        const isThisOptionSelected = currentSelection === key;
                                                                                        let btnVariant = "outline";
                                                                                        let btnColor = "gray";

                                                                                        if (isThisOptionSelected) {
                                                                                            btnVariant = "solid";
                                                                                            btnColor = isCorrect ? "green" : "red";
                                                                                        }

                                                                                        return (
                                                                                            <Button
                                                                                                key={key}
                                                                                                size="sm"
                                                                                                variant={btnVariant}
                                                                                                colorScheme={btnColor}
                                                                                                justifyContent="flex-start"
                                                                                                py={5}
                                                                                                px={4}
                                                                                                borderRadius="xl"
                                                                                                onClick={() => handleSelectOption(mIdx, key)}
                                                                                            >
                                                                                                <Text fontSize="sm" whiteSpace="normal" textAlign="left">
                                                                                                    <strong>({key})</strong> {val}
                                                                                                </Text>
                                                                                            </Button>
                                                                                        );
                                                                                    })}
                                                                                </SimpleGrid>

                                                                                {currentSelection && (
                                                                                    <Alert status={isCorrect ? "success" : "error"} borderRadius="xl" fontSize="sm" variant="subtle">
                                                                                        <AlertIcon as={isCorrect ? FaCheckCircle : FaTimesCircle} />
                                                                                        <Box>
                                                                                            <Text fontWeight="bold">
                                                                                                {isCorrect ? "बरोबर उत्तर!" : `चुकीचे उत्तर! योग्य पर्याय: (${mcq.correctOption})`}
                                                                                            </Text>
                                                                                            <Text mt={1} fontSize="xs">{mcq.explanation}</Text>
                                                                                        </Box>
                                                                                    </Alert>
                                                                                )}
                                                                            </Stack>
                                                                        );
                                                                    })}
                                                                </Stack>
                                                            </Box>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            ))
                                        ) : (
                                            <Box py={10} px={4} textAlign="center" borderWidth="1px" borderStyle="dashed" borderRadius="xl" color="gray.400" fontSize="sm" bg={cardBg}>
                                                या गटामध्ये कोणतीही माहिती उपलब्ध नाही. कृपया दुसरा पर्याय निवडा.
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
}

export default MarathiNotes;