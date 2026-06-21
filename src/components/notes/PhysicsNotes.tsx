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
    UnorderedList,
    ListItem,
    Divider,
    Badge,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
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
    FiHelpCircle,
    FiTrendingUp,
    FiInfo,
    FiChevronRight
} from "react-icons/fi";

// Safe wrapper helper to prevent react-markdown from crashing
const SafeMarkdown = ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => {
    const rawString = useMemo(() => {
        if (!children) return "";
        if (typeof children === "string") return children;
        return typeof children === "object" ? JSON.stringify(children, null, 2) : String(children);
    }, [children]);

    return (
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} {...props}>
            {rawString}
        </ReactMarkdown>
    );
};

// 🗺️ FOOLPROOF RECURSIVE MIND MAP ENGINE
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
                                <Box fontSize="sm" fontWeight="medium">
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

const PhysicsNotes = () => {
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

    // Resilient fallback properties array resolution
    const masterNotesArray = useMemo(() => targetChapterData?.master_notes || targetChapterData?.notes || [], [targetChapterData]);
    const boardQuestionsArray = useMemo(() => targetChapterData?.board_questions || targetChapterData?.boardQuestions || [], [targetChapterData]);

    // Comprehensive fallbacks for textbook properties
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

    const formatAnswerText = (text: string) => {
        if (typeof text !== "string") return text;
        let arranged = text.replace(/([^\n])\s*(\b\d+\.\s+)/g, "$1\n\n$2");
        return arranged;
    };

    const parseSummaryItems = (summaryData: any): string[] => {
        if (!summaryData) return [];
        if (Array.isArray(summaryData)) return summaryData;

        if (typeof summaryData === "string") {
            let cleanStr = summaryData.trim();
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
    };

    const cleanedSummaryList = useMemo(() => parseSummaryItems(chapterSummary), [chapterSummary]);

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
                                                    <UnorderedList spacing={3} pl={2}>
                                                        {cleanedSummaryList.map((item: string, index: number) => (
                                                            <ListItem key={index}>
                                                                <SafeMarkdown>{item}</SafeMarkdown>
                                                            </ListItem>
                                                        ))}
                                                    </UnorderedList>
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
                                            masterNotesArray.map((item: any, idx: number) => (
                                                <Card key={idx} variant="outline" bg={contentCardBg} borderRadius="xl" boxShadow="sm" borderColor={borderColor}>
                                                    <CardHeader bg={useColorModeValue("gray.50", "gray.700")} py={3} borderRadius="xl" borderBottomWidth="1px" borderColor={borderColor}>
                                                        <Heading size="md" color="gray.800">
                                                            {item.section_title}
                                                        </Heading>
                                                    </CardHeader>
                                                    <CardBody>
                                                        {item.section_breakdown?.map((breakdown: any, bIdx: number) => (
                                                            <VStack key={bIdx} align="stretch" spacing={4} mt={bIdx > 0 ? 6 : 0}>
                                                                <Heading size="sm" color="blue.600">
                                                                    <SafeMarkdown>{breakdown.sectionOrTheme}</SafeMarkdown>
                                                                </Heading>

                                                                <Box color="gray.700">
                                                                    <Text as="span" fontWeight="bold">Explanation: </Text>
                                                                    <SafeMarkdown>{breakdown.explanation}</SafeMarkdown>
                                                                </Box>

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

                                                                {breakdown.bullet_points && breakdown.bullet_points.length > 0 && (
                                                                    <UnorderedList spacing={2} pl={2}>
                                                                        {breakdown.bullet_points.map((bullet: string, bulletIdx: number) => (
                                                                            <ListItem key={bulletIdx} color="gray.700">
                                                                                <SafeMarkdown>{bullet}</SafeMarkdown>
                                                                            </ListItem>
                                                                        ))}
                                                                    </UnorderedList>
                                                                )}
                                                                {bIdx < item.section_breakdown.length - 1 && <Divider />}
                                                            </VStack>
                                                        ))}
                                                    </CardBody>
                                                </Card>
                                            ))
                                        )}
                                    </VStack>
                                </TabPanel>

                                {/* TAB 4: BOARD QUESTIONS */}
                                <TabPanel px={0}>
                                    <Accordion allowToggle>
                                        {boardQuestionsArray.length === 0 ? (
                                            <Text color="gray.400" fontStyle="italic">No Past Board exam questions linked to this chapter.</Text>
                                        ) : (
                                            boardQuestionsArray.map((q: any, idx: number) => (
                                                <AccordionItem key={idx} border="1px solid" borderColor={borderColor} borderRadius="lg" mb={3} overflow="hidden" bg={contentCardBg}>
                                                    <AccordionButton p={4} _hover={{ bg: "gray.50" }}>
                                                        <Box flex="1" textAlign="left">
                                                            <HStack spacing={3}>
                                                                <Badge colorScheme="blue" minW="60px" textAlign="center">{q.marks_badge || "Theory"}</Badge>
                                                                <Box fontWeight="semibold" color="gray.800">
                                                                    <SafeMarkdown>{q.question}</SafeMarkdown>
                                                                </Box>
                                                            </HStack>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                    <AccordionPanel pb={4} bg={useColorModeValue("gray.50", "gray.900")}>
                                                        <VStack align="stretch" spacing={3}>
                                                            <Text color="gray.700" fontWeight="medium">Answer:</Text>
                                                            <Box p={3} bg={contentCardBg} borderRadius="md" border="1px solid" borderColor={borderColor} lineHeight="tall">
                                                                <SafeMarkdown>{formatAnswerText(q.answer)}</SafeMarkdown>
                                                            </Box>
                                                        </VStack>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))
                                        )}
                                    </Accordion>
                                </TabPanel>

                                {/* TAB 5: TEXTBOOK SOLUTIONS */}
                                <TabPanel px={0}>
                                    <Accordion allowToggle>
                                        {textbookSolutionsArray.length === 0 ? (
                                            <Text color="gray.400" fontStyle="italic">No Textbook solutions matched for this segment.</Text>
                                        ) : (
                                            textbookSolutionsArray.map((sol: any, idx: number) => {
                                                // Handle varying API naming conventions for the fields inside textbook object
                                                const currentQuestion = sol.question || sol.problem || "";
                                                const currentSolution = sol.solution || sol.answer || sol.explanation || "";

                                                return (
                                                    <AccordionItem key={idx} border="1px solid" borderColor={borderColor} borderRadius="lg" mb={3} overflow="hidden" bg={contentCardBg}>
                                                        <AccordionButton p={4} _hover={{ bg: "gray.50" }}>
                                                            <Box flex="1" textAlign="left">
                                                                <HStack spacing={3}>
                                                                    <Badge colorScheme="purple" minW="60px" textAlign="center">{sol.exercise_badge || sol.badge || "Exercise"}</Badge>
                                                                    <Box fontWeight="semibold" color="gray.800">
                                                                        <SafeMarkdown>{currentQuestion}</SafeMarkdown>
                                                                    </Box>
                                                                </HStack>
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                        <AccordionPanel pb={4} bg={useColorModeValue("gray.50", "gray.900")}>
                                                            <VStack align="stretch" spacing={3}>
                                                                <Text color="gray.700" fontWeight="medium">Step-by-Step Solution:</Text>
                                                                <Box p={3} bg={contentCardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                                                                    <SafeMarkdown>{formatAnswerText(currentSolution)}</SafeMarkdown>
                                                                </Box>
                                                            </VStack>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                );
                                            })
                                        )}
                                    </Accordion>
                                </TabPanel>

                                {/* TAB 6: ACTIVE RECALL QUIZ */}
                                <TabPanel px={0}>
                                    <VStack spacing={4} align="stretch">
                                        {practiceQuizArray.length === 0 ? (
                                            <Text color="gray.400" fontStyle="italic">No active recall practice quizzes available for this chapter.</Text>
                                        ) : (
                                            practiceQuizArray.map((quiz: any, idx: number) => {
                                                const selectedOpt = selectedQuizAnswers[idx] || "";
                                                const isCorrect = selectedOpt === quiz.correct_option;
                                                const hasAnswered = !!selectedOpt;

                                                return (
                                                    <Card key={idx} variant="outline" bg={contentCardBg} borderRadius="xl" boxShadow="sm" borderColor={borderColor}>
                                                        <CardBody>
                                                            <VStack align="stretch" spacing={4}>
                                                                <HStack justify="space-between">
                                                                    <Badge colorScheme="teal">Question {idx + 1}</Badge>
                                                                    {hasAnswered && (
                                                                        <Badge colorScheme={isCorrect ? "green" : "red"}>
                                                                            {isCorrect ? "Correct" : "Incorrect"}
                                                                        </Badge>
                                                                    )}
                                                                </HStack>
                                                                <Box fontWeight="semibold" fontSize="md" color="gray.800">
                                                                    <SafeMarkdown>{quiz.question}</SafeMarkdown>
                                                                </Box>

                                                                <RadioGroup
                                                                    value={selectedOpt}
                                                                    onChange={(val) => setSelectedQuizAnswers(prev => ({ ...prev, [idx]: val }))}
                                                                >
                                                                    <Stack spacing={3} pl={2}>
                                                                        {Object.entries(quiz.options || {}).map(([key, label]: [string, any]) => {
                                                                            let radioColor = "blue";
                                                                            if (hasAnswered) {
                                                                                if (key === quiz.correct_option) radioColor = "green";
                                                                                else if (key === selectedOpt) radioColor = "red";
                                                                            }

                                                                            return (
                                                                                <Radio key={key} value={key} colorScheme={radioColor} isDisabled={hasAnswered}>
                                                                                    <HStack spacing={2}>
                                                                                        <Text fontWeight="bold">{key.toUpperCase()}:</Text>
                                                                                        <SafeMarkdown>{label}</SafeMarkdown>
                                                                                    </HStack>
                                                                                </Radio>
                                                                            );
                                                                        })}
                                                                    </Stack>
                                                                </RadioGroup>

                                                                {hasAnswered && (
                                                                    <VStack align="stretch" spacing={2} pt={2}>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            leftIcon={<FiHelpCircle />}
                                                                            onClick={() => setShowQuizExplanations(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                                                            w="fit-content"
                                                                        >
                                                                            {showQuizExplanations[idx] ? "Hide Explanation" : "Show Explanation"}
                                                                        </Button>

                                                                        {showQuizExplanations[idx] && (
                                                                            <Box p={3} bg="blue.50" borderRadius="lg" borderLeft="4px solid" borderColor="blue.400" color="blue.900" fontSize="sm">
                                                                                <Text fontWeight="bold" mb={1}>Explanation:</Text>
                                                                                <SafeMarkdown>{quiz.explanation}</SafeMarkdown>
                                                                            </Box>
                                                                        )}
                                                                    </VStack>
                                                                )}
                                                            </VStack>
                                                        </CardBody>
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
                    <Flex justify="center" align="center" minH="50vh">
                        <Text color="gray.400">Please select a chapter from the menu layout index to begin.</Text>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default PhysicsNotes;