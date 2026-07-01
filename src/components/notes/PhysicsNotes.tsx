import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
    Box,
    Flex,
    Select,
    Text,
    Heading,
    VStack,
    HStack,
    Spinner,
    Skeleton,
    Icon,
    Button,
    useColorModeValue,
    Card,
    CardHeader,
    CardBody,
    Divider,
    Badge,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    RadioGroup,
    Radio,
    Stack
} from "@chakra-ui/react";
import {
    FiBookOpen,
    FiLayers,
    FiAlertCircle,
    FiRefreshCw,
    FiAward,
    FiCpu,
    FiCheckSquare,
    FiSmile,
    FiZap,
    FiTrendingUp,
    FiInfo,
    FiChevronRight
} from "react-icons/fi";

// Safe wrapper helper to prevent react-markdown from crashing and handle malformed strings
const SafeMarkdown = ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => {
    const rawString = useMemo(() => {
        if (!children) return "";
        if (typeof children === "string") {
            return children.replace(/\\n/g, "\n");
        }
        return typeof children === "object" ? JSON.stringify(children, null, 2) : String(children);
    }, [children]);

    return (
        <Box
            w="100%"
            sx={{
                "&": { whiteSpace: "pre-wrap" },
                "& ul, & ol": { paddingLeft: "20px", marginBottom: "8px" },
                "& li": { marginBottom: "4px", lineHeight: "relaxed", color: "gray.700" }
            }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ children }) => <Text mb={2} lineHeight="relaxed">{children}</Text>,
                    ul: ({ children }) => <ul>{children}</ul>,
                    ol: ({ children }) => <ol>{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                }}
                {...props}
            >
                {rawString}
            </ReactMarkdown>
        </Box>
    );
};

// RECURSIVE MIND MAP ENGINE
const VisualMindMap = ({ data }: { data: any }) => {
    const nodeBg = useColorModeValue("blue.50", "gray.700");
    const nodeBorder = useColorModeValue("blue.200", "blue.500");
    const labelBg = useColorModeValue("purple.50", "purple.900");
    const labelColor = useColorModeValue("purple.900", "purple.100");

    if (!data) return null;

    if (typeof data === "string") {
        return <SafeMarkdown>{data}</SafeMarkdown>;
    }

    if (Array.isArray(data)) {
        return (
            <VStack align="stretch" spacing={3} pl={2}>
                {data.map((item, index) => (
                    <Box key={index}>
                        {typeof item === "string" ? (
                            <HStack spacing={2} p={2} bg={nodeBg} borderRadius="md" borderLeft="3px solid" borderColor={nodeBorder}>
                                <Icon as={FiChevronRight} color="blue.500" />
                                <Box fontSize="sm" fontWeight="medium" w="100%">
                                    <SafeMarkdown>{item}</SafeMarkdown>
                                </Box>
                            </HStack>
                        ) : (
                            <VisualMindMap data={item} />
                        )}
                    </Box>
                ))}
            </VStack>
        );
    }

    if (typeof data === "object") {
        const title = data.topic || data.title || data.label || data.name || data.heading || "";
        const targetChildren = data.children || data.nodes || data.subtopics || data.items || data.details || null;

        if (title || targetChildren) {
            return (
                <Box p={3} borderWidth="1px" borderColor="gray.200" borderRadius="xl" my={2} w="100%">
                    {title && (
                        <HStack spacing={2} p={2} bg={labelBg} borderRadius="md" w="fit-content" borderLeft="4px solid" borderColor="purple.400">
                            <Icon as={FiTrendingUp} color="purple.500" />
                            <Text fontWeight="bold" fontSize="sm" color={labelColor}>{title}</Text>
                        </HStack>
                    )}
                    {targetChildren && (
                        <Box pl={{ base: 3, md: 6 }} mt={3} borderLeft="1px dashed" borderColor="gray.300">
                            <VisualMindMap data={targetChildren} />
                        </Box>
                    )}
                </Box>
            );
        }

        return (
            <VStack align="stretch" spacing={4} w="100%">
                {Object.entries(data).map(([key, value]: [string, any]) => (
                    <Box key={key} p={3} borderWidth="1px" borderColor="gray.200" borderRadius="xl">
                        <HStack spacing={2} p={2} bg={labelBg} borderRadius="md" w="fit-content" borderLeft="4px solid" borderColor="purple.400">
                            <Icon as={FiTrendingUp} color="purple.500" />
                            <Text fontWeight="bold" fontSize="sm" color={labelColor}>{key}</Text>
                        </HStack>
                        {value && (
                            <Box pl={{ base: 3, md: 6 }} mt={3} borderLeft="1px dashed" borderColor="gray.300">
                                <VisualMindMap data={value} />
                            </Box>
                        )}
                    </Box>
                ))}
            </VStack>
        );
    }

    return null;
};

export const PhysicsNotes = () => {
    const params = useParams<Record<string, string>>();
    const rawParam = params.type || params.id || "";
    const decodedType = useMemo(() => (rawParam ? decodeURIComponent(rawParam) : ""), [rawParam]);

    const [activeChapter, setActiveChapter] = useState<string>("");
    const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, string>>({});
    const [showQuizExplanations, setShowQuizExplanations] = useState<Record<number, boolean>>({});

    const sidebarBg = useColorModeValue("white", "gray.800");
    const activeChapterBg = useColorModeValue("blue.50", "blue.900");
    const activeChapterText = useColorModeValue("blue.700", "blue.200");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const dashboardBg = useColorModeValue("gray.50", "gray.900");
    const contentCardBg = useColorModeValue("white", "gray.800");

    const {
        data: dropdownData,
        isLoading: dropdownLoading,
        isError: isDropdownError,
        refetch: refetchChapters,
    } = useQuery<any>({
        queryKey: ["chapters", decodedType],
        queryFn: async () => {
            if (!decodedType) throw new Error("Route parameter key is missing.");
            return getChapterList({ key: decodedType });
        },
        enabled: !!decodedType,
        staleTime: Infinity,
        retry: 1,
    });

    const chapters = useMemo<string[]>(() => {
        if (!dropdownData) return [];
        const target = dropdownData.data ? dropdownData.data : dropdownData;

        let rawList: any[] = [];
        const corePayload = target?.notes ? target.notes : target;
        const innerArray = Array.isArray(corePayload) ? corePayload : corePayload?.notes;

        if (Array.isArray(innerArray) && innerArray.length > 0) {
            rawList = innerArray.map(item => item?.chapter_title || item?.chapterName || item);
        } else if (target && (target.chapter_title || target.chapterName)) {
            rawList = [target.chapter_title || target.chapterName];
        } else if (target.lstChapters && Array.isArray(target.lstChapters)) {
            rawList = target.lstChapters;
        } else if (target.chapters && Array.isArray(target.chapters)) {
            rawList = target.chapters;
        }

        return Array.from(new Set(rawList.map(String).filter(Boolean)));
    }, [dropdownData]);

    useEffect(() => {
        if (chapters.length > 0 && !activeChapter) {
            setActiveChapter(chapters[0]);
        }
    }, [chapters, activeChapter]);

    const {
        data: contentResponse,
        isLoading: contentLoading,
        isError: isContentError,
        refetch: refetchContent,
    } = useQuery<any>({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType, chapter: activeChapter }),
        enabled: !!decodedType && !!activeChapter && activeChapter !== "",
        staleTime: 1000 * 60 * 20,
        retry: 1,
    });

    const targetChapterData = useMemo(() => {
        if (!contentResponse) return null;
        const root = contentResponse.data ? contentResponse.data : contentResponse;

        if (root?.notes?.notes && Array.isArray(root.notes.notes)) {
            return root.notes.notes[0];
        }
        const corePayload = root.notes ? root.notes : root;
        return Array.isArray(corePayload) ? corePayload[0] : corePayload;
    }, [contentResponse]);

    const masterNotesArray = useMemo(() => targetChapterData?.master_notes || targetChapterData?.notes || [], [targetChapterData]);
    const boardQuestionsArray = useMemo(() => targetChapterData?.board_questions || targetChapterData?.boardQuestions || [], [targetChapterData]);

    const textbookSolutionsArray = useMemo(() => {
        if (!targetChapterData) return [];
        return (
            targetChapterData.textbook_solutions ||
            targetChapterData.textbookSolutions ||
            targetChapterData.textbook_exercises ||
            targetChapterData.exercises ||
            targetChapterData.solutions ||
            []
        );
    }, [targetChapterData]);

    const practiceQuizArray = useMemo(() => targetChapterData?.practice_quiz || targetChapterData?.practiceQuiz || [], [targetChapterData]);
    const mindMapData = useMemo(() => targetChapterData?.mind_map || targetChapterData?.mindMap || null, [targetChapterData]);
    const didYouKnowData = useMemo(() => targetChapterData?.did_you_know || targetChapterData?.didYouKnow || null, [targetChapterData]);

    const chapterSummary = useMemo(() => {
        if (!contentResponse) return null;
        const root = contentResponse.data ? contentResponse.data : contentResponse;
        return root?.summary || root?.notes?.summary || targetChapterData?.summary || null;
    }, [contentResponse, targetChapterData]);

    useEffect(() => {
        setSelectedQuizAnswers({});
        setShowQuizExplanations({});
    }, [activeChapter]);

    const cleanedSummaryList = useMemo(() => {
        if (!chapterSummary) return [];
        if (Array.isArray(chapterSummary)) return chapterSummary;

        if (typeof chapterSummary === "string") {
            let cleanStr = chapterSummary.trim();
            if (cleanStr.startsWith("{") && cleanStr.endsWith("}")) {
                try {
                    const transformed = "[" + cleanStr.slice(1, -1) + "]";
                    const parsed = JSON.parse(transformed);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) {
                    return cleanStr
                        .slice(1, -1)
                        .split(/",\s*"/g)
                        .map(s => s.replace(/^"|"\s*$/g, ""));
                }
            }
            return [cleanStr];
        }
        return [];
    }, [chapterSummary]);

    const handleQuizAnswer = (questionIdx: number, option: string) => {
        setSelectedQuizAnswers(prev => ({ ...prev, [questionIdx]: option }));
        setShowQuizExplanations(prev => ({ ...prev, [questionIdx]: true }));
    };

    return (
        <Flex direction={{ base: "column", md: "row" }} minH="100vh" bg={dashboardBg}>

            {/* LEFT NAVIGATION MENU COLUMN */}
            <Box
                w={{ base: "100%", md: "300px" }}
                bg={sidebarBg}
                borderRight={{ base: "none", md: "1px solid" }}
                borderBottom="1px solid"
                borderLeftColor={{ base: "none", md: borderColor }}
                borderColor={borderColor}
                p={5}
                position={{ md: "sticky" }}
                top="0"
                h={{ md: "100vh" }}
                zIndex="10"
            >
                <VStack align="stretch" spacing={5}>
                    <HStack spacing={3}>
                        <Icon as={FiBookOpen} boxSize={5} color="blue.500" />
                        <Heading size="sm" letterSpacing="wide" textTransform="uppercase" color="gray.500">
                            Course Chapters
                        </Heading>
                    </HStack>

                    {dropdownLoading ? (
                        <HStack justify="center" py={4}>
                            <Spinner size="sm" color="blue.500" />
                            <Text fontSize="sm" color="gray.500">Loading chapters...</Text>
                        </HStack>
                    ) : isDropdownError ? (
                        <VStack align="start" p={3} bg="red.50" borderRadius="lg" spacing={2}>
                            <HStack color="red.700" fontSize="xs" fontWeight="bold">
                                <Icon as={FiAlertCircle} />
                                <Text>Connection Refused</Text>
                            </HStack>
                            <Button
                                size="xs"
                                colorScheme="red"
                                variant="outline"
                                leftIcon={<FiRefreshCw />}
                                onClick={() => refetchChapters()}
                            >
                                Retry Index
                            </Button>
                        </VStack>
                    ) : (
                        <>
                            <Box display={{ base: "block", md: "none" }}>
                                <Select
                                    value={activeChapter}
                                    onChange={(e) => setActiveChapter(e.target.value)}
                                    size="lg"
                                    bg={sidebarBg}
                                    fontWeight="semibold"
                                >
                                    {chapters.map((ch) => (
                                        <option key={ch} value={ch}>{ch}</option>
                                    ))}
                                </Select>
                            </Box>

                            <VStack display={{ base: "none", md: "flex" }} align="stretch" spacing={1} maxH="calc(100vh - 120px)" overflowY="auto">
                                {chapters.map((ch) => {
                                    const isSelected = activeChapter === ch;
                                    return (
                                        <HStack
                                            key={ch}
                                            p={3}
                                            cursor="pointer"
                                            borderRadius="lg"
                                            bg={isSelected ? activeChapterBg : "transparent"}
                                            color={isSelected ? activeChapterText : "gray.600"}
                                            _hover={{ bg: isSelected ? activeChapterBg : "gray.100" }}
                                            transition="all 0.2s"
                                            onClick={() => setActiveChapter(ch)}
                                        >
                                            <Icon as={FiLayers} color={isSelected ? "blue.500" : "gray.400"} />
                                            <Text fontWeight={isSelected ? "bold" : "medium"} fontSize="sm">
                                                {ch}
                                            </Text>
                                        </HStack>
                                    );
                                })}
                            </VStack>
                        </>
                    )}
                </VStack>
            </Box>

            {/* MAIN PORT DISPLAY VIEWPORT */}
            <Box flex="1" p={{ base: 4, md: 8 }} overflowY="auto">
                {contentLoading && activeChapter !== "" ? (
                    <VStack align="stretch" spacing={6}>
                        <Skeleton h="40px" w="40%" borderRadius="md" />
                        <Skeleton h="100px" w="100%" borderRadius="xl" />
                        <Skeleton h="200px" w="100%" borderRadius="xl" />
                    </VStack>
                ) : isContentError ? (
                    <Flex justify="center" align="center" minH="50vh" direction="column" p={6} bg={contentCardBg} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor={borderColor}>
                        <Icon as={FiAlertCircle} boxSize={10} color="red.400" mb={3} />
                        <Heading size="sm" mb={1} color="gray.800">Connection Failed</Heading>
                        <Text color="gray.500" fontSize="sm" mb={4} textAlign="center" maxW="400px">
                            Could not load textbook content profiles for "{activeChapter}".
                        </Text>
                        <Button leftIcon={<FiRefreshCw />} colorScheme="blue" size="sm" onClick={() => refetchContent()}>
                            Retry Fetching Notes
                        </Button>
                    </Flex>
                ) : activeChapter ? (
                    <Box>
                        {/* Title Context Header */}
                        <VStack align="start" spacing={3} mb={6}>
                            <Heading as="h1" size="xl" color="gray.800">
                                {activeChapter}
                            </Heading>
                        </VStack>

                        {/* HIGH-GRADE LEARNING TABS MATRIX */}
                        <Tabs variant="enclosed" colorScheme="blue" isLazy>
                            <TabList mb={4} overflowX="auto" whiteSpace="nowrap">
                                <Tab fontWeight="semibold"><Icon as={FiInfo} mr={2} /> Overview Summary</Tab>
                                {mindMapData && <Tab fontWeight="semibold"><Icon as={FiTrendingUp} mr={2} /> Conceptual Mind Map</Tab>}
                                <Tab fontWeight="semibold"><Icon as={FiBookOpen} mr={2} /> Revision Notes</Tab>
                                <Tab fontWeight="semibold"><Icon as={FiAward} mr={2} /> Board Questions ({boardQuestionsArray.length})</Tab>
                                <Tab fontWeight="semibold"><Icon as={FiCpu} mr={2} /> Textbook Solutions ({textbookSolutionsArray.length})</Tab>
                                <Tab fontWeight="semibold"><Icon as={FiCheckSquare} mr={2} /> Active Recall Quiz ({practiceQuizArray.length})</Tab>
                            </TabList>

                            <TabPanels>
                                {/* TAB 1: OVERVIEW SUMMARY */}
                                <TabPanel px={0}>
                                    <VStack spacing={6} align="stretch">
                                        {cleanedSummaryList.length > 0 ? (
                                            <Card variant="outline" bg={contentCardBg} borderRadius="xl" boxShadow="sm" borderColor={borderColor}>
                                                <CardHeader bg={useColorModeValue("blue.50", "gray.700")} py={3} borderRadius="xl" borderBottomWidth="1px" borderColor={borderColor}>
                                                    <Heading size="sm" color={useColorModeValue("blue.800", "blue.200")}>Chapter Abstract</Heading>
                                                </CardHeader>
                                                <CardBody color="gray.700" lineHeight="relaxed">
                                                    <Box sx={{ "& ul": { paddingLeft: "20px" }, "& li": { marginBottom: "8px" } }}>
                                                        <ul>
                                                            {cleanedSummaryList.map((item: string, index: number) => (
                                                                <li key={index}>
                                                                    <SafeMarkdown>{item}</SafeMarkdown>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </Box>
                                                </CardBody>
                                            </Card>
                                        ) : (
                                            <Text color="gray.400" fontStyle="italic">No overall summary abstract defined for this chapter.</Text>
                                        )}

                                        {didYouKnowData && (
                                            <VStack align="stretch" spacing={4}>
                                                {Array.isArray(didYouKnowData) ? (
                                                    didYouKnowData.map((fact: any, index: number) => (
                                                        <Box key={index} p={5} bg="orange.50" borderRadius="xl" borderLeft="5px solid" borderColor="orange.400" boxShadow="xs">
                                                            <HStack align="start" spacing={3}>
                                                                <Icon as={FiZap} color="orange.500" boxSize={5} mt={1} />
                                                                <VStack align="start" spacing={1}>
                                                                    <Text fontWeight="bold" color="orange.800" fontSize="md">
                                                                        {fact.heading || "Did You Know?"}
                                                                    </Text>
                                                                    <Box fontSize="sm" color="orange.900">
                                                                        <SafeMarkdown>{fact.explanation || fact}</SafeMarkdown>
                                                                    </Box>
                                                                </VStack>
                                                            </HStack>
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Box p={5} bg="orange.50" borderRadius="xl" borderLeft="5px solid" borderColor="orange.400" boxShadow="xs">
                                                        <HStack align="start" spacing={3}>
                                                            <Icon as={FiZap} color="orange.500" boxSize={5} mt={1} />
                                                            <VStack align="start" spacing={1}>
                                                                <Text fontWeight="bold" color="orange.800" fontSize="md">Did You Know?</Text>
                                                                <Box fontSize="sm" color="orange.900">
                                                                    <SafeMarkdown>{didYouKnowData}</SafeMarkdown>
                                                                </Box>
                                                            </VStack>
                                                        </HStack>
                                                    </Box>
                                                )}
                                            </VStack>
                                        )}
                                    </VStack>
                                </TabPanel>

                                {/* TAB 2: CONCEPTUAL MIND MAP */}
                                {mindMapData && (
                                    <TabPanel px={0}>
                                        <Card variant="outline" bg={contentCardBg} borderRadius="xl" boxShadow="sm" borderColor={borderColor}>
                                            <CardHeader bg={useColorModeValue("purple.50", "gray.700")} py={3} borderRadius="xl" borderBottomWidth="1px" borderColor={borderColor}>
                                                <HStack><Icon as={FiTrendingUp} color="purple.500" /><Heading size="sm" color="purple.800">Conceptual Mind Map</Heading></HStack>
                                            </CardHeader>
                                            <CardBody overflowX="auto">
                                                <Box p={2}>
                                                    <VisualMindMap data={mindMapData} />
                                                </Box>
                                            </CardBody>
                                        </Card>
                                    </TabPanel>
                                )}

                                {/* TAB 3: REVISION NOTES */}
                                <TabPanel px={0}>
                                    <VStack spacing={6} align="stretch">
                                        {masterNotesArray.length === 0 ? (
                                            <Text color="gray.400" fontStyle="italic">No revision notes available for this chapter.</Text>
                                        ) : (
                                            masterNotesArray.map((item: any, idx: number) => {
                                                const rawBreakdown = item.section_breakdown || item.sectionBreakdown || [];
                                                let breakdowns: any[] = [];

                                                if (Array.isArray(rawBreakdown)) {
                                                    breakdowns = rawBreakdown;
                                                } else if (typeof rawBreakdown === "string") {
                                                    try {
                                                        const parsed = JSON.parse(rawBreakdown);
                                                        if (Array.isArray(parsed)) breakdowns = parsed;
                                                    } catch (e) {
                                                        breakdowns = [];
                                                    }
                                                }

                                                return (
                                                    <Card key={idx} variant="outline" bg={contentCardBg} borderRadius="xl" boxShadow="sm" borderColor={borderColor} p={0} overflow="hidden">
                                                        <CardHeader bg={useColorModeValue("gray.50", "gray.700")} py={3} borderBottomWidth="1px" borderColor={borderColor}>
                                                            <Heading size="md" color="gray.800">
                                                                {item.section_title}
                                                            </Heading>
                                                        </CardHeader>
                                                        <CardBody>
                                                            {breakdowns.length > 0 ? (
                                                                breakdowns.map((breakdown: any, bIdx: number) => (
                                                                    <VStack key={bIdx} align="stretch" spacing={4} mt={bIdx > 0 ? 6 : 0}>
                                                                        <Heading size="sm" color="blue.600">
                                                                            <SafeMarkdown>{breakdown.sectionOrTheme || breakdown.title || ""}</SafeMarkdown>
                                                                        </Heading>

                                                                        {breakdown.explanation && (
                                                                            <Box color="gray.700">
                                                                                <Text as="span" fontWeight="bold">Explanation: </Text>
                                                                                <SafeMarkdown>{breakdown.explanation}</SafeMarkdown>
                                                                            </Box>
                                                                        )}

                                                                        {breakdown.analogy && (
                                                                            <Box p={3} bg="orange.50" borderRadius="lg" borderLeft="4px solid" borderColor="orange.400">
                                                                                <HStack align="start">
                                                                                    <Icon as={FiSmile} color="orange.500" mt={1} />
                                                                                    <Box fontSize="sm" color="orange.900">
                                                                                        <Text as="span" fontWeight="bold">Analogy: </Text>
                                                                                        <SafeMarkdown>{breakdown.analogy}</SafeMarkdown>
                                                                                    </Box>
                                                                                </HStack>
                                                                            </Box>
                                                                        )}

                                                                        {breakdown.memory_technique && (
                                                                            <Box p={3} bg="purple.50" borderRadius="lg" borderLeft="4px solid" borderColor="purple.400">
                                                                                <HStack align="start">
                                                                                    <Icon as={FiZap} color="purple.500" mt={1} />
                                                                                    <Box fontSize="sm" color="purple.900">
                                                                                        <Text as="span" fontWeight="bold">Memory Hack: </Text>
                                                                                        <SafeMarkdown>{breakdown.memory_technique}</SafeMarkdown>
                                                                                    </Box>
                                                                                </HStack>
                                                                            </Box>
                                                                        )}

                                                                        {breakdown.bullet_points && (
                                                                            <Box pl={4} mt={2}>
                                                                                <VStack align="stretch" spacing={1}>
                                                                                    {Array.isArray(breakdown.bullet_points) ? (
                                                                                        breakdown.bullet_points.map((point: string, pIdx: number) => (
                                                                                            <HStack key={pIdx} align="start" spacing={2}>
                                                                                                <Text color="blue.500" fontSize="sm">•</Text>
                                                                                                <Box fontSize="sm" color="gray.700" w="100%">
                                                                                                    <SafeMarkdown>{point}</SafeMarkdown>
                                                                                                </Box>
                                                                                            </HStack>
                                                                                        ))
                                                                                    ) : (
                                                                                        <Box fontSize="sm" color="gray.700">
                                                                                            <SafeMarkdown>{breakdown.bullet_points}</SafeMarkdown>
                                                                                        </Box>
                                                                                    )}
                                                                                </VStack>
                                                                            </Box>
                                                                        )}
                                                                    </VStack>
                                                                ))
                                                            ) : (
                                                                <Text color="gray.400" fontStyle="italic">No thematic breakdown defined for this section.</Text>
                                                            )}
                                                        </CardBody>
                                                    </Card>
                                                );
                                            })
                                        )}
                                    </VStack>
                                </TabPanel>

                                {/* TAB 4: BOARD QUESTIONS */}
                                <TabPanel px={0}>
                                    <VStack spacing={4} align="stretch">
                                        {boardQuestionsArray.length === 0 ? (
                                            <Text color="gray.400" fontStyle="italic">No previous board questions available for this chapter.</Text>
                                        ) : (
                                            <Accordion allowToggle>
                                                {boardQuestionsArray.map((q: any, qIdx: number) => (
                                                    <AccordionItem key={qIdx} border="1px solid" borderColor={borderColor} borderRadius="xl" mb={3} overflow="hidden">
                                                        <AccordionButton bg={useColorModeValue("gray.50", "gray.700")} _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}>
                                                            <Box flex="1" textAlign="left" fontWeight="semibold" fontSize="sm" py={1}>
                                                                <SafeMarkdown>{q.question || q.title || q}</SafeMarkdown>
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                        <AccordionPanel pb={4} pt={3} bg={contentCardBg}>
                                                            <Box fontSize="sm" color="gray.700">
                                                                <Text fontWeight="bold" color="blue.600" mb={2}>Solution / Marking Scheme Answer:</Text>
                                                                <SafeMarkdown>{q.answer || q.solution || "No detailed solution recorded."}</SafeMarkdown>
                                                            </Box>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        )}
                                    </VStack>
                                </TabPanel>

                                {/* TAB 5: TEXTBOOK SOLUTIONS */}
                                <TabPanel px={0}>
                                    <VStack spacing={4} align="stretch">
                                        {textbookSolutionsArray.length === 0 ? (
                                            <Text color="gray.400" fontStyle="italic">No textbook exercise solutions available for this chapter.</Text>
                                        ) : (
                                            <Accordion allowToggle>
                                                {textbookSolutionsArray.map((sol: any, sIdx: number) => (
                                                    <AccordionItem key={sIdx} border="1px solid" borderColor={borderColor} borderRadius="xl" mb={3} overflow="hidden">
                                                        <AccordionButton bg={useColorModeValue("gray.50", "gray.700")} _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}>
                                                            <Box flex="1" textAlign="left" fontWeight="semibold" fontSize="sm" py={1}>
                                                                <SafeMarkdown>{sol.question || sol.exercise || ""}</SafeMarkdown>
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                        <AccordionPanel pb={4} pt={3} bg={contentCardBg}>
                                                            <Box fontSize="sm" color="gray.700">
                                                                <Text fontWeight="bold" color="purple.600" mb={2}>Step-by-Step Solution:</Text>
                                                                <SafeMarkdown>{sol.solution || sol.answer || "No response details generated."}</SafeMarkdown>
                                                            </Box>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        )}
                                    </VStack>
                                </TabPanel>

                                {/* TAB 6: ACTIVE RECALL QUIZ */}
                                {/* TAB 6: ACTIVE RECALL QUIZ */}
                                <TabPanel px={0}>
                                    <VStack spacing={4} align="stretch">
                                        {practiceQuizArray.length === 0 ? (
                                            <Text color="gray.400" fontStyle="italic">No interactive practice quiz modules structured for this chapter.</Text>
                                        ) : (
                                            practiceQuizArray.map((quiz: any, qIdx: number) => {
                                                // 1. Defensively resolve options format (Handles Array, Object, or Stringified JSON strings)
                                                let choices: string[] = [];
                                                const rawChoices = quiz.options || quiz.choices || [];

                                                try {
                                                    if (Array.isArray(rawChoices)) {
                                                        choices = rawChoices;
                                                    } else if (typeof rawChoices === "object" && rawChoices !== null) {
                                                        choices = Object.values(rawChoices);
                                                    } else if (typeof rawChoices === "string") {
                                                        const parsed = JSON.parse(rawChoices);
                                                        choices = Array.isArray(parsed) ? parsed : Object.values(parsed);
                                                    }
                                                } catch (e) {
                                                    choices = [];
                                                }

                                                return (
                                                    <Card key={qIdx} variant="outline" borderColor={borderColor} bg={contentCardBg} borderRadius="xl" p={5} boxShadow="xs">
                                                        <Heading size="xs" color="gray.500" mb={1} textTransform="uppercase" letterSpacing="wider">
                                                            Question {qIdx + 1}
                                                        </Heading>
                                                        <Text fontWeight="bold" mb={4} color="gray.800" fontSize="sm">
                                                            <SafeMarkdown>{quiz.question}</SafeMarkdown>
                                                        </Text>

                                                        {choices.length > 0 ? (
                                                            <RadioGroup
                                                                onChange={(val) => handleQuizAnswer(qIdx, val)}
                                                                value={selectedQuizAnswers[qIdx] || ""}
                                                            >
                                                                <Stack spacing={3} pl={1}>
                                                                    {choices.map((opt: string, oIdx: number) => (
                                                                        <Radio key={oIdx} value={opt} size="md" colorScheme="blue">
                                                                            <Box fontSize="sm" color="gray.700">
                                                                                <SafeMarkdown>{opt}</SafeMarkdown>
                                                                            </Box>
                                                                        </Radio>
                                                                    ))}
                                                                </Stack>
                                                            </RadioGroup>
                                                        ) : (
                                                            <Text color="red.400" fontSize="xs" fontStyle="italic">Quiz options formatting could not be read.</Text>
                                                        )}

                                                        {showQuizExplanations[qIdx] && (
                                                            <Box mt={4} p={4} bg={useColorModeValue("blue.50", "gray.700")} borderRadius="xl" borderLeft="4px solid" borderColor="blue.400">
                                                                <HStack spacing={2} mb={1}>
                                                                    <Icon as={FiCheckSquare} color="blue.500" />
                                                                    <Text fontSize="sm" fontWeight="bold" color={useColorModeValue("blue.900", "blue.100")}>
                                                                        Correct Option: {quiz.correct_answer || quiz.correctAnswer || quiz.answer}
                                                                    </Text>
                                                                </HStack>
                                                                {quiz.explanation && (
                                                                    <Box fontSize="xs" color={useColorModeValue("blue.800", "blue.200")} mt={1} pl={6}>
                                                                        <SafeMarkdown>{quiz.explanation}</SafeMarkdown>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </Card>
                                                );
                                            })
                                        )}
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                ) : (
                    <Flex justify="center" align="center" minH="50vh" direction="column" p={6} bg={contentCardBg} borderRadius="xl" border="1px dashed" borderColor={borderColor}>
                        <Icon as={FiBookOpen} boxSize={8} color="gray.300" mb={2} />
                        <Text color="gray.500" fontSize="sm">Please choose a course textbook chapter profile from the index column to preview summaries.</Text>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default PhysicsNotes;