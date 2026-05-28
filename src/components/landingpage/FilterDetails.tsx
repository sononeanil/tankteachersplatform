import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Text, Flex, Button, Select, Divider } from "@chakra-ui/react";

import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import { GameHeader } from "../notes/GameHeader";
import NotesView from "../notes/NotesView";
import QuizView from "../notes/QuizView";
import MindMapView from "../notes/MindMap";
import { VennDiagramView } from "../notes/VennView";
import { FlowChartView } from "../notes/FlowChartView"; // 🎯 1. IMPORT DETECTED

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

    useEffect(() => {
        setQuizAnswers({});
        setReadCards({});
    }, [activeChapter]);

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

    if (isLoading) return <Text p={6} textAlign="center">Loading your study universe...</Text>;
    if (isError) return <Text p={6} color="red.500" textAlign="center">Error setting up study workspace.</Text>;

    return (
        <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto" bg="gray.50" minH="100vh">
            <GameHeader
                decodedType={decodedType}
                xp={xp}
                currentLevel={currentLevel}
                xpTowardsNextLevel={xpTowardsNextLevel}
                overallProgress={overallProgress}
            />

            <Flex
                bg="white" p={4} borderRadius="2xl" boxShadow="sm" gap={4} mb={8} align="center" wrap="wrap"
                position="sticky" top="12px" zIndex={10} backdropFilter="blur(8px)" backgroundColor="rgba(255, 255, 255, 0.95)"
                border="1px solid" borderColor="gray.100"
            >
                <Select
                    placeholder="Choose Target Chapter"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    maxW={{ base: "100%", md: "240px" }} borderRadius="xl" fontWeight="semibold"
                >
                    {chapters?.map((ch: string) => (
                        <option key={ch} value={ch}>Chapter {ch}</option>
                    ))}
                </Select>

                <Button
                    colorScheme={isCurrentChapterLoaded ? "green" : "blue"}
                    onClick={handleLoadData}
                    isDisabled={!selectedChapter || isCurrentChapterLoaded}
                    borderRadius="xl" px={6} fontSize="sm"
                >
                    {isCurrentChapterLoaded ? "Ready ✅" : "Load Dashboard Data"}
                </Button>

                <Divider orientation="vertical" height="30px" display={{ base: "none", md: "block" }} />

                <Flex gap={2} wrap="wrap" flex={1}>
                    {["Notes", "Mind Map", "Question", "Flow Chart", "Venn Diagram"].map((item) => (
                        <Button
                            key={item} onClick={() => setContentType(item)}
                            colorScheme={contentType === item ? "blue" : "gray"}
                            variant={contentType === item ? "solid" : "ghost"}
                            borderRadius="xl" size="sm" isDisabled={!activeChapter}
                        >
                            {item === "Question" ? "Practice Quiz" : item}
                        </Button>
                    ))}
                </Flex>
            </Flex>

            <Box mt={4} ref={contentRef}>
                {contentLoading && <Text textAlign="center" py={12} color="gray.500">Structuring beautiful assets...</Text>}

                {normalizedData && !contentLoading && (
                    <>
                        {contentType === "Notes" && (
                            <NotesView
                                notes={extractedNotes}
                                readCards={readCards}
                                onExplore={handleCardExplore}
                            />
                        )}

                        {contentType === "Mind Map" && (
                            <MindMapView mindMapRawData={normalizedData.mindMap} />
                        )}

                        {contentType === "Question" && (
                            <QuizView
                                questions={extractedQuestions}
                                quizAnswers={quizAnswers}
                                onAnswer={handleQuizSubmission}
                            />
                        )}

                        {contentType === "Venn Diagram" && (
                            <VennDiagramView vennData={normalizedData.vennDiagram} />
                        )}

                        {/* 🎯 2. FIXED: MOUNTED FLOW CHART ROUTE TO PREVENT PLACEHOLDER OVERWRITE */}
                        {contentType === "Flow Chart" && (
                            <FlowChartView mindMapData={normalizedData.mindMap} />
                        )}

                        {/* 🎯 3. CLEANED UP CONDITIONS TO PREVENT BLANK VISIBILITY ISSUES */}
                        {["Placeholder Demo"].includes(contentType) && (
                            <Box bg="white" p={8} borderRadius="2xl" textAlign="center" border="1px dashed" borderColor="gray.200">
                                <Text color="gray.500">{contentType} asset viewer compilation interface incoming.</Text>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default FilterDetails;