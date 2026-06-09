import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
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
    HStack,
    SimpleGrid
} from "@chakra-ui/react";
import {
    FaBookOpen, FaLightbulb, FaTimesCircle, FaCheckCircle,
    FaProjectDiagram, FaQuestionCircle, FaRoute, FaSitemap,
    FaCompass
} from "react-icons/fa";

import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import { GameHeader } from "../notes/GameHeader";
import NotesView from "../notes/NotesView";
import QuizView from "../notes/QuizView";
import MindMapView from "../notes/MindMap";
import { VennDiagramView } from "../notes/VennView";
import { FlowChartView } from "../notes/FlowChartView";
import { TreeStructureView } from "../notes/TreeStructureView";

interface CommonMistake {
    mistake: string;
    correctWay: string;
}

interface NoteNode {
    note: string;
    marksBoosterTip?: string;
    textbookQuestionReference?: string;
    commonMistakes?: CommonMistake[];
}

interface ChapterContent {
    notes: {
        notes: NoteNode[];
        questions: any[];
        summary: string;
        mindMap?: any;
        vennDiagram?: any;
    } | NoteNode[];
    questions?: any[];
    summary?: string;
    mindMap?: any;
    vennDiagram?: any;
}

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






    // Queries
    const { data: chapters, isLoading, isError } = useQuery<string[]>({
        queryKey: ["chapters", decodedType],
        queryFn: () => getChapterList({ key: decodedType! }),
        enabled: !!decodedType,
    });

    const { data: contentData, isFetching: contentLoading } = useQuery<ChapterContent>({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType!, chapter: activeChapter }),
        enabled: !!decodedType && !!activeChapter,
        staleTime: 1000 * 60 * 10,
    });

    // Data Normalization Layer
    const normalizedData = useMemo(() => {
        if (!contentData) return null;
        if ('notes' in contentData && contentData.notes && Array.isArray((contentData.notes as any).notes)) {
            return contentData.notes as any;
        }
        if (Array.isArray(contentData.notes)) {
            return contentData;
        }
        return null;
    }, [contentData]);

    const extractedNotes: NoteNode[] = normalizedData?.notes || [];
    const extractedQuestions = normalizedData?.questions || [];
    const extractedSummary: string = normalizedData?.summary || "";

    const handleLoadData = () => {
        if (selectedChapter && selectedChapter !== activeChapter) {
            setQuizAnswers({});
            setReadCards({});
            setActiveChapter(selectedChapter);
        }
    };

    // Derived Knowledge Milestones split logic
    const curatedSummaryMilestones = useMemo(() => {
        if (!extractedSummary) return [];
        return extractedSummary
            .split(/[.!?]/)
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 25);
    }, [extractedSummary]);

    // Derived Insights Parser
    const analyticalInsights = useMemo(() => {
        if (!extractedNotes.length) return { tips: [], mistakes: [], textbookRefs: [] };

        const tips: string[] = [];
        const mistakes: Array<{ mistake: string; correctWay: string; topic: string }> = [];
        const textbookRefs: Array<{ topic: string; reference: string }> = [];

        extractedNotes.forEach((node) => {
            if (node.marksBoosterTip) tips.push(node.marksBoosterTip);
            if (node.textbookQuestionReference) {
                textbookRefs.push({ topic: node.note, reference: node.textbookQuestionReference });
            }
            if (Array.isArray(node.commonMistakes)) {
                node.commonMistakes.forEach((m) => {
                    mistakes.push({ topic: node.note, mistake: m.mistake, correctWay: m.correctWay });
                });
            }
        });

        return { tips, mistakes, textbookRefs };
    }, [extractedNotes]);

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
        { id: "notes", label: "Notes", icon: FaBookOpen, view: "Notes" },
        { id: "summary", label: "Summary Brief", icon: FaCompass, view: "Summary" },
        { id: "mindmap", label: "Mind Map", icon: FaSitemap, view: "Mind Map" },
        { id: "quiz", label: "Practice Quiz", icon: FaQuestionCircle, view: "Question" },
        { id: "flowchart", label: "Flow Chart", icon: FaRoute, view: "Flow Chart" },
        { id: "treeview", label: "Tree View", icon: FaProjectDiagram, view: "Tree View" },
        { id: "venndiagram", label: "Venn Diagram", icon: FaProjectDiagram, view: "Venn Diagram" },
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
                boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.05)"
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
                                key={btn.id}
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
                    <ScaleFade initialScale={0.98} in={!contentLoading}>
                        <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="2xl" boxShadow="md" minH="600px">

                            {/* --- NOTES TAB WORKSPACE (100% Full Width) --- */}
                            {contentType === "Notes" && (
                                <Box w="100%">
                                    <NotesView notes={extractedNotes} readCards={readCards} onExplore={handleCardExplore} />
                                </Box>
                            )}

                            {/* --- SUMMARY TAB WORKSPACE (Consolidated Insights) --- */}
                            {contentType === "Summary" && (
                                <Box w="100%">
                                    <HStack spacing={3} mb={6} borderBottom="1px solid" borderColor="gray.100" pb={4}>
                                        <Icon as={FaCompass} color="blue.500" w={6} h={6} />
                                        <Text fontWeight="extrabold" fontSize="lg" color="gray.800" letterSpacing="tight">
                                            Chapter Overview & Core Mission Briefing
                                        </Text>
                                    </HStack>

                                    {extractedSummary ? (
                                        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                                            {/* Left Column: Synopsis & Key Milestones */}
                                            <GridItem colSpan={{ base: 12, lg: 8 }}>
                                                <SimpleGrid columns={1} gap={6}>
                                                    <Box bg="gray.50" p={5} borderRadius="xl">
                                                        <Text fontSize="11px" fontWeight="extrabold" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={2}>
                                                            Synopsis
                                                        </Text>
                                                        <Text fontSize="14px" color="gray.600" lineHeight="relaxed" textAlign="justify">
                                                            {extractedSummary}
                                                        </Text>
                                                    </Box>

                                                    {curatedSummaryMilestones.length > 0 && (
                                                        <Box bg="blue.50" p={5} borderRadius="xl">
                                                            <Text fontSize="11px" fontWeight="extrabold" color="blue.600" textTransform="uppercase" letterSpacing="wider" mb={3}>
                                                                Key Knowledge Checkpoints
                                                            </Text>
                                                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
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
                                            </GridItem>

                                            {/* Right Column: Misconceptions, Boosters, and Connections */}
                                            <GridItem colSpan={{ base: 12, lg: 4 }}>
                                                <Flex direction="column" gap={6}>
                                                    {/* Common Misconceptions */}
                                                    {analyticalInsights.mistakes.length > 0 && (
                                                        <Box bg="red.50" p={5} borderRadius="2xl" border="1px solid" borderColor="red.100">
                                                            <Flex align="center" mb={3}>
                                                                <Icon as={FaTimesCircle} color="red.500" w={5} h={5} mr={2} />
                                                                <Text fontWeight="extrabold" fontSize="md" color="red.800">Common Misconceptions</Text>
                                                            </Flex>
                                                            <Flex direction="column" gap={3} maxH="300px" overflowY="auto" pr={1}>
                                                                {analyticalInsights.mistakes.map((item, i) => (
                                                                    <Box key={i} bg="white" p={3} borderRadius="xl" borderLeft="4px solid" borderLeftColor="red.400">
                                                                        <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase">{item.topic}</Text>
                                                                        <Text fontSize="xs" color="red.600" fontWeight="semibold" mt={0.5}>❌ {item.mistake}</Text>
                                                                        <Text fontSize="xs" color="green.600" fontWeight="bold" mt={1}>✅ Fix: {item.correctWay}</Text>
                                                                    </Box>
                                                                ))}
                                                            </Flex>
                                                        </Box>
                                                    )}

                                                    {/* Exam Score Boosters */}
                                                    {analyticalInsights.tips.length > 0 && (
                                                        <Box bg="#FFFDF5" p={5} borderRadius="2xl" border="1px solid" borderColor="yellow.200">
                                                            <Flex align="center" mb={3}>
                                                                <Icon as={FaLightbulb} color="yellow.500" w={5} h={5} mr={2} />
                                                                <Text fontWeight="extrabold" fontSize="md" color="yellow.800">Exam Score Boosters</Text>
                                                            </Flex>
                                                            <Flex direction="column" gap={3} maxH="250px" overflowY="auto">
                                                                {analyticalInsights.tips.slice(0, 3).map((tip, idx) => (
                                                                    <Flex key={idx} bg="white" p={3} borderRadius="xl" align="start">
                                                                        <Icon as={FaCheckCircle} color="green.400" mt={0.5} mr={2} flexShrink={0} />
                                                                        <Text fontSize="xs" color="gray.600" fontWeight="medium">{tip}</Text>
                                                                    </Flex>
                                                                ))}
                                                            </Flex>
                                                        </Box>
                                                    )}

                                                    {/* Classroom Connections */}
                                                    {analyticalInsights.textbookRefs.length > 0 && (
                                                        <Box bg="purple.50" p={5} borderRadius="2xl" border="1px solid" borderColor="purple.100">
                                                            <Flex align="center" mb={3}>
                                                                <Icon as={FaBookOpen} color="purple.500" w={5} h={5} mr={2} />
                                                                <Text fontWeight="extrabold" fontSize="md" color="purple.800">Classroom Connections</Text>
                                                            </Flex>
                                                            <Flex direction="column" gap={2} maxH="220px" overflowY="auto">
                                                                {analyticalInsights.textbookRefs.map((ref, idx) => (
                                                                    <Box key={idx} bg="white" p={3} borderRadius="xl">
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
                                    ) : (
                                        <Text color="gray.400" fontStyle="italic">No summary briefing available for this chapter.</Text>
                                    )}
                                </Box>
                            )}

                            {/* --- OTHER WORKSPACES (100% full width automatically) --- */}
                            {contentType === "Mind Map" && <MindMapView mindMapRawData={normalizedData?.mindMap} />}
                            {contentType === "Question" && <QuizView questions={extractedQuestions} quizAnswers={quizAnswers} onAnswer={handleQuizSubmission} />}
                            {contentType === "Venn Diagram" && <VennDiagramView vennData={normalizedData?.vennDiagram} />}
                            {contentType === "Flow Chart" && <FlowChartView mindMapData={normalizedData?.mindMap} />}
                            {contentType === "Tree View" && <TreeStructureView mindMapData={normalizedData?.mindMap} />}
                        </Box>
                    </ScaleFade>
                )}
            </Box>
        </Box>
    );
};

export default FilterDetails;