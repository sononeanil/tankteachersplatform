import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import type { ChangeEvent } from "react"; import { useParams } from "react-router-dom";
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
import {
    FaBook,
    FaPenNib,
    FaGraduationCap,
    FaLightbulb,
    FaCheckCircle,
    FaTimesCircle,
    FaFileAlt,
    FaCommentDots
} from "react-icons/fa";

type TabType = "summary" | "explanations" | "grammar_devices_questions" | "competency_questions" | "textbook";

const EnglishNotes = () => {
    const [activeChapter, setActiveChapter] = useState<string>("");
    const [activeTab, setActiveTab] = useState<TabType>("summary");
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

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
        grammar_devices_questions: 2,
        competency_questions: 3,
        textbook: 4
    };

    const tabStringMap: TabType[] = ["summary", "explanations", "grammar_devices_questions", "competency_questions", "textbook"];

    const filteredContent = useMemo(() => {
        if (!notesList || notesList.length === 0) return [];

        switch (activeTab) {
            case "explanations":
                return notesList.filter(item =>
                    item.nodeType === "narrative_note" &&
                    !item.sectionOrTheme?.toLowerCase().includes("poetic device") &&
                    !item.sectionOrTheme?.toLowerCase().includes("grammar") &&
                    !item.sectionOrTheme?.toLowerCase().includes("vocabulary") &&
                    !(item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0)
                );
            case "grammar_devices_questions":
                return notesList.filter(item =>
                    item.sectionOrTheme?.toLowerCase().includes("poetic device") ||
                    item.sectionOrTheme?.toLowerCase().includes("grammar") ||
                    item.sectionOrTheme?.toLowerCase().includes("vocabulary") ||
                    item.sectionOrTheme?.toLowerCase().includes("figures of speech") ||
                    (item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0) ||
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

    const handleSelectOption = (mcqKey: string, optionKey: string) => {
        setSelectedAnswers(prev => ({ ...prev, [mcqKey]: optionKey.trim().toUpperCase() }));
    };

    return (
        <Box minH="100vh" bgGradient={bgGradient} py={{ base: 6, md: 10 }} px={{ base: 3, md: 6 }}>
            <Container maxW="container.lg">

                <VStack spacing={2} align="center" mb={{ base: 6, md: 10 }} textAlign="center">
                    <Heading as="h1" size={{ base: "xl", md: "2xl" }} color={headingColor} fontWeight="extrabold" letterSpacing="tight">
                        English Language & Literature Study Portal
                    </Heading>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.500" fontWeight="medium">
                        Classes 6th to 12th • Smart Digital Notes & Interactive Exercises
                    </Text>
                </VStack>

                <Box bg={cardBg} p={{ base: 4, md: 5 }} borderRadius="2xl" boxShadow="sm" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} mb={6} maxW={{ base: "100%", md: "sm" }}>
                    <Stack spacing={2}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.600">Select Chapter / Poem:</Text>
                        <Select
                            value={activeChapter}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setActiveChapter(e.target.value)}
                            disabled={dropdownLoading || chapters.length === 0}
                            size="lg"
                            borderRadius="xl"
                            fontWeight="medium"
                        >
                            {dropdownLoading && <option>Loading chapters...</option>}
                            {!dropdownLoading && chapters.length === 0 && <option>No chapters found</option>}
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
                        <Text fontSize="sm" fontWeight="medium" color="orange.500">Loading study resources...</Text>
                    </Flex>
                )}

                {!contentLoading && notesList.length > 0 && (
                    <Stack spacing={6}>
                        <Box bg={cardBg} borderRadius="2xl" boxShadow="sm" overflow="hidden" border="1px" borderColor={useColorModeValue("gray.100", "gray.700")} p={2}>
                            <Tabs
                                isFitted
                                variant="soft-rounded"
                                colorScheme="orange"
                                index={tabIndexMap[activeTab]}
                                onChange={(index) => setActiveTab(tabStringMap[index])}
                            >
                                <TabList display="flex" flexWrap="wrap" gap={1} p={1}>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaFileAlt} mr={1.5} display={{ base: "none", sm: "inline" }} />Summary</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaBook} mr={1.5} display={{ base: "none", sm: "inline" }} />Explanation</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 90%", sm: "1" }}><Icon as={FaPenNib} mr={1.5} display={{ base: "none", sm: "inline" }} />Grammar, Devices & Qs</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaCommentDots} mr={1.5} display={{ base: "none", sm: "inline" }} />Competency Qs</Tab>
                                    <Tab borderRadius="xl" fontSize={{ base: "xs", md: "sm" }} py={3} px={2} flex={{ base: "1 1 45%", sm: "1" }}><Icon as={FaGraduationCap} mr={1.5} display={{ base: "none", sm: "inline" }} />Textbook Exercises</Tab>
                                </TabList>
                            </Tabs>

                            <Box p={{ base: 2, md: 4 }}>
                                {activeTab === "summary" && (
                                    <Box bg={summaryBg} border="1px" borderColor={summaryBorder} p={{ base: 5, md: 8 }} borderRadius="xl" mt={2}>
                                        <HStack spacing={2} mb={4}>
                                            <Icon as={FaFileAlt} color="orange.600" boxSize={5} />
                                            <Heading as="h2" size="md" color="orange.900">Core Content Summary</Heading>
                                        </HStack>
                                        <Text whiteSpace="pre-line" color={textColor} fontSize={{ base: "sm", md: "md" }} lineHeight="tall">
                                            {chapterSummary || "Summary contents are presently unavailable for this module."}
                                        </Text>
                                    </Box>
                                )}

                                {activeTab !== "summary" && (
                                    <Stack spacing={5} mt={2}>
                                        {filteredContent.length > 0 ? (
                                            filteredContent.map((item, idx) => (
                                                <Box key={idx} p={{ base: 4, md: 6 }} borderWidth="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" bg={cardBg} shadow="xs">

                                                    <Flex justify="space-between" align="center" wrap="wrap" gap={2} mb={4} borderBottom="1px" pb={3} borderColor={useColorModeValue("gray.100", "gray.700")}>
                                                        <Heading size="sm" color="blue.600" maxW={{ base: "70%", md: "80%" }}>{item.sectionOrTheme || "Study Analysis"}</Heading>
                                                        <Badge colorScheme="blue" variant="subtle" px={2.5} py={0.5} borderRadius="md" fontSize="xs">{item.nodeType?.replace(/_/g, ' ')}</Badge>
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
                                                                <Text fontWeight="medium"><strong>Critical Study Tip:</strong> {item.analysis.criticalAnalysisTip}</Text>
                                                            </HStack>
                                                        )}

                                                        {/* Vocabulary Block */}
                                                        {item.analysis?.contextualVocabulary && item.analysis.contextualVocabulary.length > 0 && (
                                                            <Box mt={2}>
                                                                <Text fontSize="sm" fontWeight="bold" mb={3} color="purple.600">📌 Vocabulary & Literary Terms:</Text>
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

                                                        {/* Textbook Exercises Block */}
                                                        {activeTab === "textbook" && item.fullTextbookSolutions && item.fullTextbookSolutions.length > 0 && (
                                                            <Stack spacing={3} mt={2}>
                                                                {item.fullTextbookSolutions.map((sol: any, sIdx: number) => (
                                                                    <Box key={sIdx} p={4} bg={useColorModeValue("teal.50/30", "teal.900/10")} border="1px" borderColor={useColorModeValue("teal.100", "teal.900/40")} borderRadius="xl">
                                                                        <Flex justify="space-between" align="start" gap={2} mb={1}>
                                                                            <Text fontWeight="bold" fontSize="sm" color={headingColor}>
                                                                                Q{sol.questionNumber}. {sol.textbookQuestion}
                                                                            </Text>
                                                                            {sol.marks && (
                                                                                <Badge colorScheme="orange" variant="solid" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold" flexShrink={0}>
                                                                                    {sol.marks} M
                                                                                </Badge>
                                                                            )}
                                                                        </Flex>
                                                                        <Divider my={2} />
                                                                        <Text fontSize="sm" pl={2} borderLeftWidth="2px" borderLeftColor="teal.400" color={textColor} whiteSpace="pre-line">
                                                                            <strong style={{ color: '#0D9488' }}>Model Answer:</strong> {sol.modelAnswer}
                                                                        </Text>
                                                                    </Box>
                                                                ))}
                                                            </Stack>
                                                        )}

                                                        {/* Extract Questions */}
                                                        {item.cbseExtractBasedQuestions && item.cbseExtractBasedQuestions.length > 0 && (
                                                            <Stack spacing={4} mt={2}>
                                                                {item.cbseExtractBasedQuestions.map((ext: any, eIdx: number) => (
                                                                    <Stack key={eIdx} p={3} bg="blue.50/20" border="1px" borderColor="blue.100" borderRadius="xl" spacing={3}>
                                                                        <Text p={2.5} bg={cardBg} borderRadius="md" borderStyle="dashed" borderWidth="1px" fontSize="sm" fontStyle="italic" color="gray.600">
                                                                            "{ext.verbatimExcerpt}"
                                                                        </Text>
                                                                        {ext.questions?.map((q: any, qIdx: number) => (
                                                                            <Stack key={qIdx} spacing={1} fontSize="sm">
                                                                                <Flex align="center" gap={1.5} wrap="wrap">
                                                                                    <Text fontWeight="bold">👉 {q.questionText}</Text>
                                                                                    <Badge colorScheme="blue" fontSize="2xs">{q.questionType}</Badge>
                                                                                </Flex>
                                                                                <Text pl={2} color={textColor}><strong>Answer:</strong> {q.modelAnswer}</Text>
                                                                            </Stack>
                                                                        ))}
                                                                    </Stack>
                                                                ))}
                                                            </Stack>
                                                        )}

                                                        {/* MCQs Quiz Block with Smart Hybrid Matching Architecture */}
                                                        {item.quickCheckMCQs && item.quickCheckMCQs.length > 0 && (
                                                            <Stack spacing={5} mt={4}>
                                                                <Heading size="xs" color="orange.600" textTransform="uppercase" letterSpacing="wide" mb={1}>
                                                                    🎯 Quick Quiz Assessment
                                                                </Heading>
                                                                {item.quickCheckMCQs.map((mcq: any, mIdx: number) => {
                                                                    const textClean = mcq.questionText ? mcq.questionText.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) : "q";
                                                                    const mcqKey = mcq.id || `${idx}-${mIdx}-${textClean}`;

                                                                    const selectedOption = selectedAnswers[mcqKey];
                                                                    const isAnswered = !!selectedOption;

                                                                    // Extract raw answer text/key from backend
                                                                    const rawCorrectField = mcq.correctOptionKey ?? mcq.correctOption ?? mcq.answer ?? "";
                                                                    const sanitizedAnswerString = String(rawCorrectField).trim().toUpperCase();

                                                                    // Translate numeric strings to Option Characters
                                                                    let normalizedCorrectKey = sanitizedAnswerString;
                                                                    if (sanitizedAnswerString === "0") normalizedCorrectKey = "A";
                                                                    if (sanitizedAnswerString === "1") normalizedCorrectKey = "B";
                                                                    if (sanitizedAnswerString === "2") normalizedCorrectKey = "C";
                                                                    if (sanitizedAnswerString === "3") normalizedCorrectKey = "D";

                                                                    // Find out if the user selected the actual correct element
                                                                    // We match against either the letter identifier ('A') OR the explicit option content text
                                                                    let isUserCorrect = false;
                                                                    if (isAnswered && mcq.options) {
                                                                        Object.entries(mcq.options).forEach(([key, value]) => {
                                                                            const currentKeyUpper = key.trim().toUpperCase();
                                                                            const currentValueUpper = String(value).trim().toUpperCase();
                                                                            if (selectedOption === currentKeyUpper) {
                                                                                if (currentKeyUpper === normalizedCorrectKey || currentValueUpper === sanitizedAnswerString) {
                                                                                    isUserCorrect = true;
                                                                                }
                                                                            }
                                                                        });
                                                                    }

                                                                    return (
                                                                        <Box key={mcqKey} p={{ base: 4, md: 5 }} borderWidth="1px" borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="xl" bg={useColorModeValue("gray.50/50", "gray.700/10")}>
                                                                            <Text fontWeight="bold" fontSize="sm" color={headingColor} mb={4}>
                                                                                Question {mIdx + 1}: {mcq.questionText}
                                                                            </Text>
                                                                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mb={isAnswered ? 4 : 0}>
                                                                                {mcq.options && Object.entries(mcq.options).map(([key, value]: [string, any]) => {
                                                                                    const currentKeyUpper = key.trim().toUpperCase();
                                                                                    const currentValueUpper = String(value).trim().toUpperCase();

                                                                                    const isCurrentSelected = selectedOption === currentKeyUpper;

                                                                                    // HYBRID EVALUATION FIX: True if Key matches ('A' === 'A') OR Option text matches verbatim
                                                                                    const isCorrectKey = (currentKeyUpper === normalizedCorrectKey) || (currentValueUpper === sanitizedAnswerString);

                                                                                    let rightIcon = undefined;
                                                                                    let buttonBg = useColorModeValue("white", "gray.800");
                                                                                    let buttonTextColor = textColor;
                                                                                    let borderColorToken = useColorModeValue("gray.200", "gray.600");

                                                                                    if (isAnswered) {
                                                                                        if (isCorrectKey) {
                                                                                            buttonBg = "green.500";
                                                                                            buttonTextColor = "white";
                                                                                            borderColorToken = "green.500";
                                                                                            rightIcon = <Icon as={FaCheckCircle} color="white" />;
                                                                                        } else if (isCurrentSelected) {
                                                                                            buttonBg = "red.500";
                                                                                            buttonTextColor = "white";
                                                                                            borderColorToken = "red.500";
                                                                                            rightIcon = <Icon as={FaTimesCircle} color="white" />;
                                                                                        } else {
                                                                                            buttonBg = useColorModeValue("gray.50", "gray.700");
                                                                                            buttonTextColor = useColorModeValue("gray.400", "gray.500");
                                                                                            borderColorToken = useColorModeValue("gray.100", "gray.700");
                                                                                        }
                                                                                    }

                                                                                    return (
                                                                                        <Button
                                                                                            key={key}
                                                                                            onClick={() => !isAnswered && handleSelectOption(mcqKey, key)}
                                                                                            variant="outline"
                                                                                            justifyContent="space-between"
                                                                                            py={6}
                                                                                            px={4}
                                                                                            borderRadius="xl"
                                                                                            fontSize="sm"
                                                                                            fontWeight="medium"
                                                                                            whiteSpace="normal"
                                                                                            textAlign="left"
                                                                                            height="auto"
                                                                                            bg={buttonBg}
                                                                                            color={buttonTextColor}
                                                                                            borderColor={borderColorToken}
                                                                                            cursor={isAnswered ? "not-allowed" : "pointer"}
                                                                                            _hover={isAnswered ? {} : { bg: useColorModeValue("orange.50/50", "gray.700") }}
                                                                                            _active={isAnswered ? {} : {}}
                                                                                        >
                                                                                            <HStack spacing={3} align="start">
                                                                                                <Badge
                                                                                                    variant={isAnswered && (isCorrectKey || isCurrentSelected) ? "solid" : "subtle"}
                                                                                                    colorScheme={isAnswered ? (isCorrectKey ? "green" : isCurrentSelected ? "red" : "gray") : "gray"}
                                                                                                    borderRadius="md"
                                                                                                    px={2}
                                                                                                    py={0.5}
                                                                                                >
                                                                                                    {currentKeyUpper}
                                                                                                </Badge>
                                                                                                <Text noOfLines={2} color={buttonTextColor}>{value}</Text>
                                                                                            </HStack>
                                                                                            {rightIcon}
                                                                                        </Button>
                                                                                    );
                                                                                })}
                                                                            </SimpleGrid>

                                                                            {isAnswered && (
                                                                                <Box p={3.5} bg={isUserCorrect ? "green.50/60" : "red.50/40"} borderRadius="xl" borderWidth="1px" borderColor={isUserCorrect ? "green.100" : "red.100"} fontSize="xs">
                                                                                    <VStack align="start" spacing={1.5}>
                                                                                        <HStack>
                                                                                            <Icon as={isUserCorrect ? FaCheckCircle : FaTimesCircle} color={isUserCorrect ? "green.600" : "red.600"} />
                                                                                            <Text fontWeight="bold" color={isUserCorrect ? "green.900" : "red.900"}>
                                                                                                {isUserCorrect ? "Excellent! Correct Answer." : `Incorrect Selection! The correct answer is Option (${normalizedCorrectKey.length === 1 ? normalizedCorrectKey : rawCorrectField}).`}
                                                                                            </Text>
                                                                                        </HStack>
                                                                                        {mcq.explanationText && (
                                                                                            <Text pl={5} color={useColorModeValue("gray.700", "gray.300")} lineHeight="relaxed">
                                                                                                <strong>Explanation:</strong> {mcq.explanationText}
                                                                                            </Text>
                                                                                        )}
                                                                                    </VStack>
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    );
                                                                })}
                                                            </Stack>
                                                        )}

                                                        {/* Competency Panel */}
                                                        {activeTab === "competency_questions" && (
                                                            <Stack spacing={4} mt={2}>
                                                                {item.msbshseCompetencyLongAnswers?.map((long: any, lIdx: number) => (
                                                                    <Stack key={`msbshse-${lIdx}`} p={4} bg="orange.50/20" border="1px" borderColor="orange.100" borderRadius="xl" spacing={3}>
                                                                        <Flex justify="space-between" align="start">
                                                                            <Text fontWeight="bold" fontSize="sm">💬 {long.questionPrompt}</Text>
                                                                            {long.marks && <Badge colorScheme="orange" variant="solid" px={3} py={1} borderRadius="full" fontSize="xs">{long.marks} M</Badge>}
                                                                        </Flex>
                                                                        {long.markingSchemeCoreValuePoints?.length > 0 && (
                                                                            <Box bg="orange.50" p={3} borderRadius="xl">
                                                                                <Text fontSize="xs" fontWeight="bold" color="orange.800" mb={1}>Key Scheme Points:</Text>
                                                                                <OrderedList spacing={1} pl={4}>
                                                                                    {long.markingSchemeCoreValuePoints.map((p: string, pIdx: number) => (
                                                                                        <ListItem key={pIdx} fontSize="xs" color="orange.900">{p.replace(/^[0-9०-९].\s*/, '')}</ListItem>
                                                                                    ))}
                                                                                </OrderedList>
                                                                            </Box>
                                                                        )}
                                                                        <Text fontSize="sm" color={textColor} whiteSpace="pre-line"><strong>Exemplar Answer:</strong> {long.modelTopperAnswer}</Text>
                                                                    </Stack>
                                                                ))}

                                                                {item.cbseCompetencyLongAnswers?.map((long: any, lIdx: number) => (
                                                                    <Stack key={`cbse-${lIdx}`} p={4} bg="cyan.50/20" border="1px" borderColor="cyan.100" borderRadius="xl" spacing={3}>
                                                                        <Text fontWeight="bold" fontSize="sm">💬 {long.questionPrompt}</Text>
                                                                        {long.markingSchemeCoreValuePoints?.length > 0 && (
                                                                            <Box bg="cyan.50" p={3} borderRadius="xl">
                                                                                <Text fontSize="xs" fontWeight="bold" color="cyan.800" mb={1}>Value Points:</Text>
                                                                                <OrderedList spacing={1} pl={4}>
                                                                                    {long.markingSchemeCoreValuePoints.map((p: string, pIdx: number) => (
                                                                                        <ListItem key={pIdx} fontSize="xs" color="cyan.900">{p.replace(/^[0-9०-९].\s*/, '')}</ListItem>
                                                                                    ))}
                                                                                </OrderedList>
                                                                            </Box>
                                                                        )}
                                                                        <Text fontSize="sm" color={textColor} whiteSpace="pre-line"><strong>High-Scoring Model Answer:</strong> {long.modelTopperAnswer}</Text>
                                                                    </Stack>
                                                                ))}
                                                            </Stack>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            ))
                                        ) : (
                                            <Flex justify="center" align="center" minH="150px">
                                                <Text fontSize="sm" color="gray.400" fontStyle="italic">No study elements found for this segment.</Text>
                                            </Flex>
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

export default EnglishNotes;