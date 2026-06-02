import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Box,
    Text,
    Flex,
    Button,
    Select,
    Divider,
    Grid,
    GridItem,
    Badge,
    Icon,
    ScaleFade,
    Collapse,
    VStack,
    HStack,
    SimpleGrid
} from "@chakra-ui/react";
import {
    FaBookOpen, FaLightbulb, FaTimesCircle, FaCheckCircle,
    FaProjectDiagram, FaQuestionCircle, FaRoute, FaSitemap,
    FaChevronDown, FaChevronUp, FaCompass
} from "react-icons/fa";

import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import { GameHeader } from "../notes/GameHeader";
import NotesView from "../notes/NotesView";
import QuizView from "../notes/QuizView";
import MindMapView from "../notes/MindMap";
import { VennDiagramView } from "../notes/VennView";
import { FlowChartView } from "../notes/FlowChartView";
import { TreeStructureView } from "../notes/TreeStructureView";

const FilterDetails = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { type } = useParams<{ type: string }>();
    const decodedType = type ? decodeURIComponent(type) : null;

    const [selectedChapter, setSelectedChapter] = useState<string>("");
    const [activeChapter, setActiveChapter] = useState<string>("");
    const [contentType, setContentType] = useState<string>("Notes");
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
    const [readCards, setReadCards] = useState<Record<number, boolean>>({});
    const [xp, setXp] = useState<number>(0);

    // Summary expand/collapse state toggle
    const [isSummaryExpanded, setIsSummaryExpanded] = useState<boolean>(false);

    const { data: chapters, isLoading, isError } = useQuery({
        queryKey: ["chapters", decodedType],
        queryFn: () => getChapterList({ key: decodedType! }),
        enabled: !!decodedType,
    });

    const { data: contentData, isFetching: contentLoading } = useQuery({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType!, chapter: activeChapter }),
        enabled: !!decodedType && !!activeChapter,
        staleTime: 1000 * 60 * 10,
    });

    const normalizedData = useMemo(() => {
        if (!contentData) return null;
        if (contentData.notes && Array.isArray(contentData.notes.notes)) {
            return contentData.notes;
        }
        if (Array.isArray(contentData.notes)) {
            return contentData;
        }
        return null;
    }, [contentData]);

    const extractedNotes = normalizedData?.notes || [];
    const extractedQuestions = normalizedData?.questions || [];
    const extractedSummary = normalizedData?.summary || "";

    useEffect(() => {
        setQuizAnswers({});
        setReadCards({});
        setIsSummaryExpanded(false);
    }, [activeChapter]);

    // Break the text summary into discrete bullet milestones for easier reading
    const curatedSummaryMilestones = useMemo(() => {
        if (!extractedSummary) return [];
        return extractedSummary
            .split(/[.!?]/)
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 25);
    }, [extractedSummary]);

    const analyticalInsights = useMemo(() => {
        if (!extractedNotes.length) return { tips: [], mistakes: [], textbookRefs: [] };

        const tips: string[] = [];
        const mistakes: Array<{ mistake: string; correctWay: string; topic: string }> = [];
        const textbookRefs: Array<{ topic: string; reference: string }> = [];

        extractedNotes.forEach((node: any) => {
            if (node.marksBoosterTip) tips.push(node.marksBoosterTip);
            if (node.textbookQuestionReference) {
                textbookRefs.push({ topic: node.note, reference: node.textbookQuestionReference });
            }
            if (Array.isArray(node.commonMistakes)) {
                node.commonMistakes.forEach((m: any) => {
                    mistakes.push({ topic: node.note, mistake: m.mistake, correctWay: m.correctWay });
                });
            }
        });

        return { tips, mistakes, textbookRefs };
    }, [extractedNotes]);

    const handleLoadData = () => {
        if (selectedChapter) {
            setActiveChapter(selectedChapter);
        }
    };

    const isCurrentChapterLoaded = selectedChapter === activeChapter && !!normalizedData;
    const currentLevel = useMemo(() => Math.floor(xp / 200) + 1, [xp]);
    const xpTowardsNextLevel = useMemo(() => xp % 200, [xp]);

    const overallProgress = useMemo(() => {
        const totalTasks = extractedNotes.length + extractedQuestions.length;
        if (totalTasks === 0) return 0;
        return Math.round(((Object.keys(readCards).length + Object.keys(quizAnswers).length) / totalTasks) * 100);
    }, [extractedNotes, extractedQuestions, readCards, quizAnswers]);

    const handleCardExplore = (index: number) => {
        if (!readCards[index]) {
            setReadCards(prev => ({ ...prev, [index]: true }));
            setXp(prev => prev + 10);
        }
    };

    const handleQuizSubmission = (qIndex: number, option: string, isCorrect: boolean) => {
        setQuizAnswers(prev => ({ ...prev, [qIndex]: option }));
        setXp(prev => prev + (isCorrect ? 50 : 15));
    };

    const toolbarConfiguration = [
        { label: "Notes", icon: FaBookOpen, view: "Notes" },
        { label: "Mind Map", icon: FaSitemap, view: "Mind Map" },
        { label: "Practice Quiz", icon: FaQuestionCircle, view: "Question" },
        { label: "Flow Chart", icon: FaRoute, view: "Flow Chart" },
        { label: "Tree View", icon: FaProjectDiagram, view: "Tree View" },
        { label: "Venn Diagram", icon: FaProjectDiagram, view: "Venn Diagram" },
    ];

    if (isLoading) return <Text p={6} color="blue.500" fontWeight="bold" textAlign="center">Loading your study universe...</Text>;
    if (isError) return <Text p={6} color="red.500" textAlign="center">Error setting up study workspace.</Text>;

    return (
        <Box p={{ base: 4, md: 8 }} maxW="1600px" mx="auto" bg="gray.50" minH="100vh">
            <GameHeader
                decodedType={decodedType}
                xp={xp}
                currentLevel={currentLevel}
                xpTowardsNextLevel={xpTowardsNextLevel}
                overallProgress={overallProgress}
            />

            {/* Sticky Navigation Dashboard */}
            <Flex
                bg="white" p={4} borderRadius="2xl"
                boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
                gap={4} mb={6} align="center" wrap="wrap"
                position="sticky" top="12px" zIndex={10} backdropFilter="blur(12px)" backgroundColor="rgba(255, 255, 255, 0.92)"
                border="1px solid" borderColor="gray.100"
                transition="all 0.2s"
            >
                <Select
                    placeholder="Choose Target Chapter"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    maxW={{ base: "100%", md: "260px" }} borderRadius="xl" fontWeight="bold"
                    borderColor="gray.200" size="md" focusBorderColor="blue.400"
                    boxShadow="sm"
                >
                    {chapters?.map((ch: string) => (
                        <option key={ch} value={ch}>Chapter {ch}</option>
                    ))}
                </Select>

                <Button
                    colorScheme={isCurrentChapterLoaded ? "green" : "blue"}
                    onClick={handleLoadData}
                    isDisabled={!selectedChapter || isCurrentChapterLoaded}
                    borderRadius="xl" px={6} fontSize="sm" fontWeight="bold"
                    boxShadow="md" _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    _active={{ transform: "translateY(0)" }} transition="all 0.15s"
                >
                    {isCurrentChapterLoaded ? "Ready ✅" : "Load Dashboard Data"}
                </Button>

                <Divider orientation="vertical" height="30px" display={{ base: "none", md: "block" }} borderColor="gray.300" />

                <Flex gap={2} wrap="wrap" flex={1}>
                    {toolbarConfiguration.map((btn) => {
                        const isSelected = contentType === btn.view;
                        return (
                            <Button
                                key={btn.view}
                                onClick={() => setContentType(btn.view)}
                                colorScheme={isSelected ? "blue" : "gray"}
                                variant={isSelected ? "solid" : "outline"}
                                leftIcon={<Icon as={btn.icon} />}
                                borderRadius="xl" size="sm" isDisabled={!activeChapter}
                                fontWeight="bold" px={4} py={4} boxShadow={isSelected ? "md" : "none"}
                                _hover={{ transform: "translateY(-1px)", bg: isSelected ? "blue.600" : "gray.100" }}
                                transition="all 0.2s"
                            >
                                {btn.label}
                            </Button>
                        );
                    })}
                </Flex>
            </Flex>

            <Box mt={4} ref={contentRef}>
                {contentLoading && (
                    <Text textAlign="center" py={12} fontSize="lg" fontWeight="semibold" color="blue.500">
                        Structuring beautiful assets...
                    </Text>
                )}

                {normalizedData && !contentLoading && (
                    <Flex direction="column" gap={6}>

                        {/* 🎯 PREMIUM FULL-WIDTH MISSION SUMMARY (Positioned prominently over workspace modules) */}
                        {extractedSummary && (
                            <Box
                                bg="white"
                                p={{ base: 5, md: 6 }}
                                borderRadius="2xl"
                                boxShadow="0 4px 20px -2px rgba(0, 0, 0, 0.02), 0 12px 30px -10px rgba(0,0,0,0.04)"
                                border="1px solid"
                                borderColor="blue.100"
                                position="relative"
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                width="100%"
                            >
                                <Box position="absolute" top={0} bottom={0} left={0} w="5px" bg="blue.500" borderRadius="left" />

                                <Flex align="center" justify="space-between" mb={3} cursor="pointer" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                                    <HStack spacing={3}>
                                        <Icon as={FaCompass} color="blue.500" w={5} h={5} />
                                        <Text fontWeight="extrabold" fontSize="md" color="gray.800" letterSpacing="tight">
                                            Chapter Overview & Core Core Mission Briefing
                                        </Text>
                                    </HStack>
                                    <Button
                                        size="sm"
                                        variant="light"
                                        bg="blue.50"
                                        color="blue.600"
                                        borderRadius="xl"
                                        onClick={(e) => { e.stopPropagation(); setIsSummaryExpanded(!isSummaryExpanded); }}
                                        leftIcon={<Icon as={isSummaryExpanded ? FaChevronUp : FaChevronDown} />}
                                    >
                                        {isSummaryExpanded ? "Collapse Brief" : "Expand Summary"}
                                    </Button>
                                </Flex>

                                {/* Dynamic Width Workspace Layout Switching */}
                                <Collapse in={isSummaryExpanded} startingHeight={48} animateOpacity>
                                    <SimpleGrid columns={{ base: 1, lg: isSummaryExpanded ? 2 : 1 }} gap={8} mt={isSummaryExpanded ? 4 : 1}>

                                        {/* Left Column: Full Text Prose Block */}
                                        <Box>
                                            {isSummaryExpanded && (
                                                <Text fontSize="11px" fontWeight="extrabold" color="gray.400" uppercase letterSpacing="wider" mb={2}>
                                                    Synopsis Synopsis
                                                </Text>
                                            )}
                                            <Text fontSize="14px" color="gray.600" lineHeight="relaxed" textAlign="justify">
                                                {extractedSummary}
                                            </Text>
                                        </Box>

                                        {/* Right Column: Knowledge Roadmap Checkpoints (Only mounts when block is expanded) */}
                                        {isSummaryExpanded && curatedSummaryMilestones.length > 0 && (
                                            <Box
                                                pl={{ lg: 6 }}
                                                borderLeft={{ lg: "1px dashed" }}
                                                borderColor={{ lg: "gray.200" }}
                                            >
                                                <Text fontSize="11px" fontWeight="extrabold" color="blue.600" uppercase letterSpacing="wider" mb={3}>
                                                    Key Knowledge Checkpoints
                                                </Text>
                                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                                                    {curatedSummaryMilestones.map((milestone, idx) => (
                                                        <HStack key={idx} align="start" spacing={2.5}>
                                                            <Icon as={FaCheckCircle} color="blue.400" w={4} h={4} mt={0.5} flexShrink={0} />
                                                            <Text fontSize="xs" color="gray.600" fontWeight="medium" lineHeight="short">
                                                                {milestone}.
                                                            </Text>
                                                        </HStack>
                                                    ))}
                                                </SimpleGrid>
                                            </Box>
                                        )}
                                    </SimpleGrid>
                                </Collapse>

                                {!isSummaryExpanded && (
                                    <Button
                                        variant="link"
                                        colorScheme="blue"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        mt={2}
                                        onClick={() => setIsSummaryExpanded(true)}
                                        _hover={{ textDecoration: "none" }}
                                    >
                                        Read complete structural briefing...
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Interactive Main Split Viewer Workspace Dock */}
                        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                            {/* Main Content Workspace Element Area */}
                            <GridItem colSpan={{ base: 12, xl: 9 }}>
                                <ScaleFade initialScale={0.98} in={!contentLoading}>
                                    <Box
                                        bg="white" p={{ base: 4, md: 6 }} borderRadius="2xl"
                                        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 10px 10px -5px rgba(0, 0, 0, 0.02)"
                                        border="1px solid" borderColor="gray.100" minH="600px"
                                    >
                                        {contentType === "Notes" && (
                                            <NotesView notes={extractedNotes} readCards={readCards} onExplore={handleCardExplore} />
                                        )}

                                        {contentType === "Mind Map" && (
                                            <MindMapView mindMapRawData={normalizedData.mindMap} />
                                        )}

                                        {contentType === "Question" && (
                                            <QuizView questions={extractedQuestions} quizAnswers={quizAnswers} onAnswer={handleQuizSubmission} />
                                        )}

                                        {contentType === "Venn Diagram" && (
                                            <VennDiagramView vennData={normalizedData.vennDiagram} />
                                        )}

                                        {contentType === "Flow Chart" && (
                                            <FlowChartView mindMapData={normalizedData.mindMap} />
                                        )}

                                        {contentType === "Tree View" && (
                                            <TreeStructureView mindMapData={normalizedData.mindMap} />
                                        )}
                                    </Box>
                                </ScaleFade>
                            </GridItem>

                            {/* Right Sidebar Elements - Dynamic Insights Deck */}
                            <GridItem colSpan={{ base: 12, xl: 3 }}>
                                <Flex direction="column" gap={6}>
                                    {/* Pitfalls to Evade Panel */}
                                    {analyticalInsights.mistakes.length > 0 && (
                                        <Box bg="red.50" p={5} borderRadius="2xl" boxShadow="md" border="1px solid" borderColor="red.100">
                                            <Flex align="center" mb={3}>
                                                <Icon as={FaTimesCircle} color="red.500" w={5} h={5} mr={2} />
                                                <Text fontWeight="extrabold" fontSize="md" color="red.800">Common Misconceptions</Text>
                                            </Flex>
                                            <Flex direction="column" gap={3} maxH="280px" overflowY="auto" pr={1}>
                                                {analyticalInsights.mistakes.slice(0, 3).map((item, i) => (
                                                    <Box key={i} bg="white" p={3} borderRadius="xl" boxShadow="sm" borderLeft="4px solid" borderLeftColor="red.400">
                                                        <Text fontSize="xs" color="gray.400" fontWeight="bold" uppercase>{item.topic}</Text>
                                                        <Text fontSize="xs" color="red.600" fontWeight="semibold" mt={0.5}>❌ {item.mistake}</Text>
                                                        <Text fontSize="xs" color="green.600" fontWeight="bold" mt={1}>✅ Fix: {item.correctWay}</Text>
                                                    </Box>
                                                ))}
                                            </Flex>
                                        </Box>
                                    )}

                                    {/* Marks Booster Tips Deck */}
                                    {analyticalInsights.tips.length > 0 && (
                                        <Box bg="amber.50" backgroundColor="#FFFDF5" p={5} borderRadius="2xl" boxShadow="md" border="1px solid" borderColor="yellow.200">
                                            <Flex align="center" mb={3}>
                                                <Icon as={FaLightbulb} color="yellow.500" w={5} h={5} mr={2} />
                                                <Text fontWeight="extrabold" fontSize="md" color="yellow.800">Exam Score Boosters</Text>
                                            </Flex>
                                            <Flex direction="column" gap={3} maxH="250px" overflowY="auto">
                                                {analyticalInsights.tips.slice(0, 3).map((tip, idx) => (
                                                    <Flex key={idx} bg="white" p={3} borderRadius="xl" boxShadow="xs" align="start">
                                                        <Icon as={FaCheckCircle} color="green.400" mt={0.5} mr={2} flexShrink={0} />
                                                        <Text fontSize="xs" color="gray.600" fontWeight="medium">{tip}</Text>
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        </Box>
                                    )}

                                    {/* Textbook Exercises Integration Area */}
                                    {analyticalInsights.textbookRefs.length > 0 && (
                                        <Box bg="purple.50" p={5} borderRadius="2xl" boxShadow="md" border="1px solid" borderColor="purple.100">
                                            <Flex align="center" mb={3}>
                                                <Icon as={FaBookOpen} color="purple.500" w={5} h={5} mr={2} />
                                                <Text fontWeight="extrabold" fontSize="md" color="purple.800">Classroom Connections</Text>
                                            </Flex>
                                            <Flex direction="column" gap={2} maxH="220px" overflowY="auto">
                                                {analyticalInsights.textbookRefs.map((ref, idx) => (
                                                    <Box key={idx} bg="white" p={3} borderRadius="xl" boxShadow="sm">
                                                        <Badge colorScheme="purple" fontSize="10px" mb={1}>{ref.topic}</Badge>
                                                        <Text fontSize="xs" color="gray.600" fontWeight="semibold" noOfLines={3}>
                                                            {ref.reference}
                                                        </Text>
                                                    </Box>
                                                ))}
                                            </Flex>
                                        </Box>
                                    )}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default FilterDetails;