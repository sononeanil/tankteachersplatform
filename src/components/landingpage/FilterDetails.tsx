import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Text,
    Box,
    Select,
    Flex,
    Button,
    VStack,
    HStack,
    Heading,
    Badge,
    Divider,
    Icon,
    SimpleGrid,
    Tag,
    TagLabel,
    Collapse,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Progress,
    Tooltip
} from "@chakra-ui/react";
import { useMemo, useRef, useState, useEffect } from "react";
import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider } from "reactflow";
import 'reactflow/dist/style.css';
import html2pdf from "html2pdf.js";
import { toPng } from "html-to-image";
import { PdfLayout } from "../notes/PdfLayout";
import { parseMindMap } from "../../service/ParseMindMap";
import VennView from "../notes/VennView";
import { buildFlow, nodeTypes } from "../notes/FlowChartNode";
import FlowChartControlPanel from "../notes/FlowChartControlPanel";
import { StarIcon, ChevronDownIcon, ChevronUpIcon, DownloadIcon, CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

const FilterDetails = () => {
    const pdfRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { type } = useParams();
    const decodedType = type ? decodeURIComponent(type) : null;

    const [selectedChapter, setSelectedChapter] = useState("");
    const [contentType, setContentType] = useState("Notes");
    const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

    // 🎮 Gamification States
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(3); // Mocked starter streak
    const [readCards, setReadCards] = useState<Record<number, boolean>>({});

    const queryClient = useQueryClient();

    const isCached = !!queryClient.getQueryData([
        "chapterContent",
        decodedType,
        selectedChapter,
    ]);

    const { data: chapters, isLoading, isError } = useQuery({
        queryKey: ["chapters", decodedType],
        queryFn: () => getChapterList({ key: decodedType! }),
        enabled: !!decodedType,
    });

    const { data: contentData, isFetching: contentLoading, refetch: fetchChapterDetails } = useQuery({
        queryKey: ["chapterContent", decodedType, selectedChapter],
        queryFn: () => getChapterNotes({ key: decodedType!, chapter: selectedChapter }),
        enabled: false,
        staleTime: Infinity,
    });

    // Reset chapter progress when switching chapters
    useEffect(() => {
        setFlippedCards({});
        setQuizAnswers({});
        setReadCards({});
    }, [selectedChapter]);

    const flowData = useMemo(() => {
        if (contentType === "Flow Chart" && contentData?.mindMap) {
            const parsed = parseMindMap(contentData.mindMap);
            return buildFlow(parsed);
        }
        return { nodes: [], edges: [] };
    }, [contentData, contentType]);

    // Calculate real-time completion percentage
    const overallProgress = useMemo(() => {
        if (!contentData) return 0;
        const totalNotes = contentData.notes?.length || 0;
        const totalQuestions = contentData.questions?.length || 0;
        const totalTasks = totalNotes + totalQuestions;

        if (totalTasks === 0) return 0;

        const completedNotes = Object.keys(readCards).length;
        const completedQuestions = Object.keys(quizAnswers).length;

        return Math.round(((completedNotes + completedQuestions) / totalTasks) * 100);
    }, [contentData, readCards, quizAnswers]);

    const toggleCard = (index: number) => {
        setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));

        // Award XP on first time exploring this card
        if (!readCards[index]) {
            setReadCards(prev => ({ ...prev, [index]: true }));
            setXp(prev => prev + 10);
        }
    };

    const handleSelectOption = (qIndex: number, option: string, correctAnswer: string) => {
        setQuizAnswers(prev => ({ ...prev, [qIndex]: option }));

        // Award bonus XP if the answer is correct
        if (option === correctAnswer) {
            setXp(prev => prev + 50);
        } else {
            setXp(prev => prev + 15); // Consolation XP for trying!
        }
    };

    // Calculate level based on XP formula
    const currentLevel = Math.floor(xp / 200) + 1;
    const xpTowardsNextLevel = xp % 200;

    const opt = {
        margin: 0.5,
        filename: `${selectedChapter}-${contentType}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const }
    };

    const handleDownloadPDFAll = () => {
        if (!pdfRef.current) return;
        const completeOpt = { ...opt, filename: `${decodedType}-Ch${selectedChapter}.pdf` };
        html2pdf().set(completeOpt).from(pdfRef.current).save();
    };

    const handleDownloadPDF = () => {
        if (!contentRef.current) return;
        html2pdf().set(opt).from(contentRef.current).save();
    };

    const handleDownloadHTML = async () => {
        if (!contentRef.current) return;
        const dataUrl = await toPng(contentRef.current);
        const htmlContent = `<html><body style="text-align:center; font-family: sans-serif; background: #F7FAFC; padding: 20px;"><h2>${selectedChapter} - ${contentType}</h2><img src="${dataUrl}" style="max-width:100%; border-radius:12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" /></body></html>`;
        const blob = new Blob([htmlContent], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedChapter}-${contentType}.html`;
        link.click();
    };

    const MindMapNode = ({ node, level = 0 }: any) => {
        const [open, setOpen] = useState(level < 2);
        const colors = ["brand.500", "teal.400", "purple.400", "pink.400", "orange.400"];

        return (
            <Box ml={level * 6} mt={3} position="relative">
                {level > 0 && <Box position="absolute" left="-16px" top="18px" width="16px" height="2px" bg="gray.300" />}
                <Box
                    display="inline-flex"
                    alignItems="center"
                    px={4} py={2.5}
                    bg={colors[level % colors.length] || "blue.400"}
                    color="white" borderRadius="xl" cursor="pointer" boxShadow="sm" fontWeight="bold" fontSize="sm"
                    onClick={() => setOpen(!open)}
                    _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                    transition="all 0.2s"
                >
                    {node.children?.length > 0 && (open ? <ChevronDownIcon mr={1} /> : <ChevronUpIcon mr={1} />)}
                    {node.name}
                </Box>
                {open && node.children?.length > 0 && (
                    <Box borderLeft="2px solid" borderColor="gray.200" ml={4} pl={4} mt={1}>
                        {node.children.map((child: any, idx: number) => (
                            <MindMapNode key={idx} node={child} level={level + 1} />
                        ))}
                    </Box>
                )}
            </Box>
        );
    };

    if (isLoading) return <Text p={6} textAlign="center" fontWeight="medium">Loading your study universe...</Text>;
    if (isError) return <Text p={6} color="red.500" textAlign="center">Error setting up study workspace.</Text>;

    return (
        <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto" bg="gray.50" minH="100vh">

            {/* 🎮 GAMIFIED HUB HEADER PANEL */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
                <Box bg="white" p={4} borderRadius="2xl" border="1px solid" borderColor="gray.100" shadow="sm">
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={0}>
                            <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Workspace Status</Text>
                            <Heading size="sm" color="gray.800" fontWeight="black" letterSpacing="tight">
                                {decodedType || "Revision Area"}
                            </Heading>
                        </VStack>
                        <Tooltip label="Keep studying daily to protect your fire streak!">
                            <Badge colorScheme="orange" variant="subtle" px={3} py={1.5} borderRadius="xl" fontSize="xs" fontWeight="black">
                                🔥 {streak} Day Streak
                            </Badge>
                        </Tooltip>
                    </HStack>
                </Box>

                <Box bg="white" p={4} borderRadius="2xl" border="1px solid" borderColor="gray.100" shadow="sm">
                    <VStack align="stretch" spacing={1}>
                        <HStack justify="space-between">
                            <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Rank Level</Text>
                            <Text fontSize="xs" fontWeight="black" color="blue.600">LVL {currentLevel}</Text>
                        </HStack>
                        <HStack spacing={2} align="center">
                            <Progress value={(xpTowardsNextLevel / 200) * 100} colorScheme="blue" size="sm" borderRadius="full" w="100%" bg="gray.100" />
                            <Badge colorScheme="blue" borderRadius="md" variant="solid" fontSize="10px">{xp} XP</Badge>
                        </HStack>
                    </VStack>
                </Box>

                <Box bg="white" p={4} borderRadius="2xl" border="1px solid" borderColor="gray.100" shadow="sm">
                    <VStack align="stretch" spacing={1}>
                        <HStack justify="space-between">
                            <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Chapter Mastered Progress</Text>
                            <Text fontSize="xs" fontWeight="black" color={overallProgress === 100 ? "green.500" : "purple.500"}>
                                {overallProgress}% Complete
                            </Text>
                        </HStack>
                        <Progress value={overallProgress} colorScheme={overallProgress === 100 ? "green" : "purple"} size="sm" borderRadius="full" bg="gray.100" />
                    </VStack>
                </Box>
            </SimpleGrid>

            {/* Sticky Action Navigation Filter Dashboard Container */}
            <Flex
                bg="white" p={4} borderRadius="2xl" boxShadow="0 4px 20px -4px rgba(160, 174, 192, 0.15)"
                gap={4} mb={8} align="center" wrap="wrap" position="sticky" top="12px" zIndex={10}
                backdropFilter="blur(8px)" backgroundColor="rgba(255, 255, 255, 0.95)" border="1px solid" borderColor="gray.100"
            >
                <Select
                    placeholder="Choose Target Chapter"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    maxW={{ base: "100%", md: "240px" }} borderRadius="xl" fontWeight="semibold" borderColor="gray.200"
                    _hover={{ borderColor: "blue.400" }}
                >
                    {chapters?.map((ch: string) => (
                        <option key={ch} value={ch}>Chapter {ch}</option>
                    ))}
                </Select>

                <Button
                    colorScheme="blue" onClick={() => fetchChapterDetails()} isDisabled={!selectedChapter || isCached}
                    borderRadius="xl" px={6} fontSize="sm" fontWeight="bold"
                    boxShadow={isCached ? "none" : "0 4px 12px rgba(49, 130, 206, 0.24)"}
                >
                    {isCached ? "Ready ✅" : "Load Dashboard Data"}
                </Button>

                <Divider orientation="vertical" height="30px" display={{ base: "none", md: "block" }} />

                <Flex gap={2} wrap="wrap" flex={1}>
                    {["Notes", "Mind Map", "Question", "Mind Map2", "Flow Chart", "Venn Diagram"].map((item) => (
                        <Button
                            key={item} onClick={() => setContentType(item)}
                            colorScheme={contentType === item ? "blue" : "gray"}
                            variant={contentType === item ? "solid" : "ghost"}
                            borderRadius="xl" size="sm" px={4} fontWeight="bold" isDisabled={!selectedChapter}
                        >
                            {item === "Question" ? "Practice Quiz" : item === "Mind Map2" ? "Interactive Tree" : item}
                        </Button>
                    ))}
                </Flex>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="purple" size="sm" borderRadius="xl" px={4} leftIcon={<DownloadIcon />}>
                        Export Assets
                    </MenuButton>
                    <MenuList borderRadius="xl" shadow="xl" border="none" p={1}>
                        <MenuItem onClick={handleDownloadPDF} fontSize="sm" fontWeight="medium" borderRadius="lg">Download Page View (PDF)</MenuItem>
                        <MenuItem onClick={handleDownloadPDFAll} fontSize="sm" fontWeight="medium" borderRadius="lg">Download Whole Notebook (PDF)</MenuItem>
                        <MenuItem onClick={handleDownloadHTML} fontSize="sm" fontWeight="medium" borderRadius="lg">Export HTML Layout Canvas</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            {/* Central Content Render Canvas Box */}
            <Box mt={4}>
                {contentLoading && (
                    <Text textAlign="center" py={12} color="gray.500" fontSize="sm" fontWeight="medium">
                        Structuring beautiful assets, hold tight...
                    </Text>
                )}

                {contentData && (
                    <div ref={contentRef}>
                        {/* 📘 FLASHCARDS / NOTES VIEW CONTAINER */}
                        {contentType === "Notes" && (
                            <VStack spacing={8} align="stretch" w="100%">
                                <HStack justify="space-between" pb={3} borderBottom="1px solid" borderColor="gray.200">
                                    <VStack align="start" spacing={0}>
                                        <Heading size="md" color="gray.800" fontWeight="black">Chapter Core Breakdown</Heading>
                                        <Text fontSize="xs" color="gray.500">Click cards to reveal targeted exam boosters. Each distinct explore step yields +10 XP!</Text>
                                    </VStack>
                                    <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                                        {contentData.notes?.length || 0} Critical Milestones
                                    </Badge>
                                </HStack>

                                <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
                                    {contentData.notes?.map((item: any, index: number) => {
                                        const isFlipped = !!flippedCards[index];
                                        const hasRead = !!readCards[index];
                                        return (
                                            <Box
                                                key={index} bg="white" borderRadius="2xl" p={6}
                                                border="1px solid" borderColor={isFlipped ? "blue.200" : (hasRead ? "green.100" : "gray.100")}
                                                boxShadow="0 4px 6px -1px rgba(0,0,0,0.02)" position="relative"
                                                transition="all 0.25s" cursor="pointer"
                                                onClick={() => toggleCard(index)}
                                                _hover={{ boxShadow: "0 12px 24px -4px rgba(160, 174, 192, 0.2)", transform: "translateY(-3px)" }}
                                            >
                                                <Box position="absolute" left={0} top={0} bottom={0} w="5px" bgGradient="linear(to-b, blue.400, purple.400)" borderTopLeftRadius="2xl" borderBottomLeftRadius="2xl" />

                                                <VStack align="stretch" spacing={4}>
                                                    <Flex justify="space-between" align="center">
                                                        <HStack spacing={3}>
                                                            <Flex bg={hasRead ? "green.50" : "blue.50"} color={hasRead ? "green.600" : "blue.600"} h="32px" w="32px" align="center" justify="center" borderRadius="xl" fontWeight="black" fontSize="sm">
                                                                {hasRead ? "✓" : index + 1}
                                                            </Flex>
                                                            <Text fontWeight="extrabold" fontSize="md" color="gray.800" maxW="80%">
                                                                {item.note}
                                                            </Text>
                                                        </HStack>
                                                        <Tag size="sm" colorScheme={isFlipped ? "purple" : "gray"} borderRadius="full" fontWeight="bold">
                                                            {isFlipped ? "Technical Parameters" : "Explanation"}
                                                        </Tag>
                                                    </Flex>
                                                    <Divider borderColor="gray.100" />
                                                    {!isFlipped ? (
                                                        <Text color="gray.600" lineHeight="relaxed" fontSize="sm" minH="54px">
                                                            {item.explanation}
                                                        </Text>
                                                    ) : (
                                                        <VStack align="stretch" spacing={3} minH="54px" bg="gray.50" p={3} borderRadius="xl">
                                                            {item.examKeywords && (
                                                                <Box>
                                                                    <Text fontSize="xs" fontWeight="black" color="gray.500" textTransform="uppercase" mb={1.5}>Target Exam Keywords</Text>
                                                                    <Flex gap={1.5} flexWrap="wrap">
                                                                        {item.examKeywords.map((kw: string, i: number) => (
                                                                            <Tag key={i} size="sm" colorScheme="teal" borderRadius="md" fontWeight="bold"><TagLabel>{kw}</TagLabel></Tag>
                                                                        ))}
                                                                    </Flex>
                                                                </Box>
                                                            )}
                                                            {item.marksBoosterTip && (
                                                                <Box borderTop="1px dashed" borderColor="gray.200" pt={2}>
                                                                    <Text fontSize="xs" fontWeight="black" color="orange.600" textTransform="uppercase" mb={0.5}>🚀 Strategic Marks Booster Point</Text>
                                                                    <Text fontSize="xs" color="gray.600" fontWeight="medium">{item.marksBoosterTip}</Text>
                                                                </Box>
                                                            )}
                                                        </VStack>
                                                    )}
                                                </VStack>
                                            </Box>
                                        );
                                    })}
                                </SimpleGrid>
                            </VStack>
                        )}

                        {/* ❓ ACTIVE QUIZ PRACTICE WINDOW */}
                        {contentType === "Question" && (
                            <VStack spacing={6} align="stretch" w="100%">
                                <VStack align="start" spacing={0} pb={2} borderBottom="1px solid" borderColor="gray.200">
                                    <Heading size="md" color="gray.800" fontWeight="black">Active Recall Knowledge Check</Heading>
                                    <Text fontSize="xs" color="gray.500">Test your mastery! Correct answers reward a massive +50 XP bonus layout hit.</Text>
                                </VStack>

                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                    {contentData.questions?.map((q: any, index: number) => {
                                        const selectedOption = quizAnswers[index];
                                        const hasAnswered = selectedOption !== undefined;
                                        const isCorrect = selectedOption === q.answer;

                                        return (
                                            <Box
                                                key={index} bg="white" p={6} borderRadius="2xl" shadow="sm"
                                                border="1px solid" borderColor={hasAnswered ? (isCorrect ? "green.200" : "red.200") : "gray.100"}
                                            >
                                                <VStack align="stretch" spacing={4}>
                                                    <HStack align="start" spacing={3}>
                                                        <Flex bg={hasAnswered ? (isCorrect ? "green.500" : "red.500") : "blue.500"} color="white" minW="28px" h="28px" borderRadius="lg" align="center" justify="center" fontSize="xs" fontWeight="black">
                                                            Q{index + 1}
                                                        </Flex>
                                                        <Text fontWeight="extrabold" fontSize="sm" color="gray.800">
                                                            {q.question}
                                                        </Text>
                                                    </HStack>

                                                    <VStack align="stretch" spacing={2.5}>
                                                        {q.options.map((option: string, i: number) => {
                                                            const isSelected = selectedOption === option;
                                                            let optionBg = "gray.50";
                                                            let optionBorderColor = "gray.200";

                                                            if (isSelected) {
                                                                optionBg = isCorrect ? "green.50" : "red.50";
                                                                optionBorderColor = isCorrect ? "green.500" : "red.500";
                                                            } else if (hasAnswered && option === q.answer) {
                                                                optionBg = "green.50";
                                                                optionBorderColor = "green.300";
                                                            }

                                                            return (
                                                                <Flex
                                                                    key={i} align="center" px={4} py={3} borderRadius="xl" border="2px solid"
                                                                    borderColor={optionBorderColor} bg={optionBg}
                                                                    cursor={hasAnswered ? "not-allowed" : "pointer"}
                                                                    fontWeight="semibold" fontSize="xs" transition="all 0.15s"
                                                                    onClick={() => !hasAnswered && handleSelectOption(index, option, q.answer)}
                                                                    _hover={hasAnswered ? {} : { bg: "blue.50", borderColor: "blue.300" }}
                                                                >
                                                                    <Box mr={3} h="6px" w="6px" borderRadius="full" bg={isSelected ? "currentColor" : "gray.400"} />
                                                                    <Text flex={1}>{option}</Text>
                                                                </Flex>
                                                            );
                                                        })}
                                                    </VStack>
                                                    <Collapse in={hasAnswered} animateOpacity>
                                                        <HStack p={3} borderRadius="xl" bg={isCorrect ? "green.50" : "red.50"} color={isCorrect ? "green.800" : "red.800"} fontSize="xs" fontWeight="bold">
                                                            <Icon as={isCorrect ? CheckCircleIcon : WarningIcon} />
                                                            <Text>{isCorrect ? "Splendid! +50 XP Collected." : `Review Needed! Correct target item parameter is: ${q.answer}`}</Text>
                                                        </HStack>
                                                    </Collapse>
                                                </VStack>
                                            </Box>
                                        );
                                    })}
                                </SimpleGrid>
                            </VStack>
                        )}

                        {/* Other visual elements render standard views layout safely */}
                        {contentType === "Mind Map" && (
                            <Box p={6} bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" boxShadow="sm">
                                <Box bg="gray.900" p={4} borderRadius="xl" overflowX="auto">
                                    <Text whiteSpace="pre-wrap" fontFamily="mono" color="green.300" fontSize="xs">{contentData.mindMap}</Text>
                                </Box>
                            </Box>
                        )}

                        {contentType === "Mind Map2" && contentData.mindMap && (
                            <Box p={6} bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" overflowX="auto">
                                <MindMapNode node={parseMindMap(contentData.mindMap)} />
                            </Box>
                        )}

                        {contentType === "Flow Chart" && contentData?.mindMap && (
                            <Box height="620px" w="100%" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" bg="white" position="relative" overflow="hidden">
                                <ReactFlowProvider>
                                    <ReactFlow nodes={flowData.nodes} edges={flowData.edges} nodeTypes={nodeTypes} fitView onInit={(ins) => setTimeout(() => ins.fitView(), 120)}>
                                        <Background variant={BackgroundVariant.Dots} color="#CBD5E0" gap={24} size={1} />
                                        <Controls />
                                        <MiniMap />
                                    </ReactFlow>
                                    <FlowChartControlPanel />
                                </ReactFlowProvider>
                            </Box>
                        )}

                        {contentType === "Venn Diagram" && (
                            <Box p={6} bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" minH="500px">
                                {contentData?.vennDiagram ? <VennView data={contentData.vennDiagram} /> : <Text textAlign="center" pt={10} color="gray.400" fontWeight="bold">No diagram maps set here.</Text>}
                            </Box>
                        )}
                    </div>
                )}
            </Box>

            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div ref={pdfRef}>
                    <PdfLayout contentData={contentData} selectedChapter={selectedChapter} />
                </div>
            </div>
        </Box>
    );
};

export default FilterDetails;