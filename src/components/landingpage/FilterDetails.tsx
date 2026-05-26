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
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
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

    const flowData = useMemo(() => {
        if (contentType === "Flow Chart" && contentData?.mindMap) {
            const parsed = parseMindMap(contentData.mindMap);
            return buildFlow(parsed);
        }
        return { nodes: [], edges: [] };
    }, [contentData, contentType]);

    const toggleCard = (index: number) => {
        setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleSelectOption = (qIndex: number, option: string) => {
        setQuizAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const opt = {
        margin: 0.5,
        filename: `${selectedChapter}-${contentType}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const }
    };

    const handleDownloadPDFAll = () => {
        if (!pdfRef.current) return;
        const completeOpt = {
            ...opt,
            filename: `${decodedType}-Ch${selectedChapter}.pdf`
        };
        html2pdf().set(completeOpt).from(pdfRef.current).save();
    };

    const handleDownloadPDF = () => {
        if (!contentRef.current) return;
        html2pdf().set(opt).from(contentRef.current).save();
    };

    const handleDownloadHTML = async () => {
        if (!contentRef.current) return;
        const dataUrl = await toPng(contentRef.current);
        const htmlContent = `
        <html>
        <body style="text-align:center; font-family: sans-serif; background: #F7FAFC; padding: 20px;">
            <h2>${selectedChapter} - ${contentType}</h2>
            <img src="${dataUrl}" style="max-width:100%; border-radius:12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        </body>
        </html>`;
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
                {level > 0 && (
                    <Box position="absolute" left="-16px" top="18px" width="16px" height="2px" bg="gray.300" />
                )}
                <Box
                    display="inline-flex"
                    alignItems="center"
                    px={4}
                    py={2.5}
                    bg={colors[level % colors.length] || "blue.400"}
                    color="white"
                    borderRadius="xl"
                    cursor="pointer"
                    boxShadow="sm"
                    fontWeight="bold"
                    fontSize="sm"
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
            {/* Top Minimalist Header Section */}
            <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
                <Box>
                    <Heading size="md" color="gray.800" fontWeight="black" letterSpacing="tight">
                        {decodedType || "Dashboard Workspace"}
                    </Heading>
                    <Text fontSize="xs" color="gray.500" mt={0.5}>
                        Pick a module below to launch tailored dynamic content revision guides.
                    </Text>
                </Box>

                {selectedChapter && (
                    <Badge colorScheme="purple" px={3} py={1} borderRadius="lg" fontSize="xs" textTransform="uppercase" fontWeight="bold">
                        Chapter {selectedChapter} Loaded
                    </Badge>
                )}
            </Flex>

            {/* Sticky Action Filter Dashboard Container Bar */}
            <Flex
                bg="white"
                p={4}
                borderRadius="2xl"
                boxShadow="0 4px 20px -4px rgba(160, 174, 192, 0.15)"
                gap={4}
                mb={8}
                align="center"
                wrap="wrap"
                position="sticky"
                top="12px"
                zIndex={10}
                backdropFilter="blur(8px)"
                backgroundColor="rgba(255, 255, 255, 0.95)"
                border="1px solid"
                borderColor="gray.100"
            >
                <Select
                    placeholder="Choose Target Chapter"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    maxW={{ base: "100%", md: "240px" }}
                    borderRadius="xl"
                    fontWeight="semibold"
                    size="md"
                    borderColor="gray.200"
                    _hover={{ borderColor: "blue.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                >
                    {chapters?.map((ch: string) => (
                        <option key={ch} value={ch}>Chapter {ch}</option>
                    ))}
                </Select>

                <Button
                    colorScheme="blue"
                    onClick={() => fetchChapterDetails()}
                    isDisabled={!selectedChapter || isCached}
                    borderRadius="xl"
                    px={6}
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow={isCached ? "none" : "0 4px 12px rgba(49, 130, 206, 0.24)"}
                    _hover={{ transform: isCached ? "none" : "translateY(-1px)" }}
                >
                    {isCached ? "Ready ✅" : "Load Dashboard Data"}
                </Button>

                <Divider orientation="vertical" height="30px" display={{ base: "none", md: "block" }} />

                <Flex gap={2} wrap="wrap" flex={1}>
                    {["Notes", "Mind Map", "Question", "Mind Map2", "Flow Chart", "Venn Diagram"].map((item) => (
                        <Button
                            key={item}
                            onClick={() => setContentType(item)}
                            colorScheme={contentType === item ? "blue" : "gray"}
                            variant={contentType === item ? "solid" : "ghost"}
                            borderRadius="xl"
                            size="sm"
                            px={4}
                            fontWeight="bold"
                            isDisabled={!selectedChapter}
                            _active={{ transform: "scale(0.98)" }}
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

            {/* Central Content Section Workspace Render */}
            <Box mt={4}>
                {contentLoading && (
                    <Text textAlign="center" py={12} color="gray.500" fontSize="sm" fontWeight="medium">
                        Structuring beautiful assets, hold tight...
                    </Text>
                )}

                {contentData && (
                    <div ref={contentRef}>
                        {/* 📘 DYNAMIC ENHANCED NOTES VIEW CONTAINER */}
                        {contentType === "Notes" && (
                            <VStack spacing={8} align="stretch" w="100%">
                                <HStack justify="space-between" pb={3} borderBottom="1px solid" borderColor="gray.200">
                                    <VStack align="start" spacing={0}>
                                        <Heading size="md" color="gray.800" fontWeight="black">Chapter Core Breakdown</Heading>
                                        <Text fontSize="xs" color="gray.500">Click any card block to expand or focus on strict metrics criteria guidelines.</Text>
                                    </VStack>
                                    <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                                        {contentData.notes?.length || 0} Critical Milestones
                                    </Badge>
                                </HStack>

                                <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
                                    {contentData.notes?.map((item: any, index: number) => {
                                        const isFlipped = !!flippedCards[index];
                                        return (
                                            <Box
                                                key={index}
                                                bg="white"
                                                borderRadius="2xl"
                                                p={6}
                                                border="1px solid"
                                                borderColor={isFlipped ? "blue.100" : "gray.100"}
                                                boxShadow="0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)"
                                                position="relative"
                                                transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                                                cursor="pointer"
                                                onClick={() => toggleCard(index)}
                                                _hover={{
                                                    boxShadow: "0 12px 24px -4px rgba(160, 174, 192, 0.25)",
                                                    transform: "translateY(-3px)",
                                                    borderColor: "blue.200"
                                                }}
                                            >
                                                {/* Visual Accent ID Anchor Badge Left */}
                                                <Box
                                                    position="absolute"
                                                    left={0} top={0} bottom={0} w="5px"
                                                    bgGradient="linear(to-b, blue.400, purple.400)"
                                                    borderTopLeftRadius="2xl"
                                                    borderBottomLeftRadius="2xl"
                                                />

                                                <VStack align="stretch" spacing={4}>
                                                    <Flex justify="space-between" align="center">
                                                        <HStack spacing={3}>
                                                            <Flex bg="blue.50" color="blue.600" h="32px" w="32px" align="center" justify="center" borderRadius="xl" fontWeight="black" fontSize="sm">
                                                                {index + 1}
                                                            </Flex>
                                                            <Text fontWeight="extrabold" fontSize="md" color="gray.800" maxW="80%">
                                                                {item.note}
                                                            </Text>
                                                        </HStack>
                                                        <Tag size="sm" colorScheme={isFlipped ? "purple" : "gray"} borderRadius="full" fontWeight="bold" variant="subtle">
                                                            {isFlipped ? "Technical Parameters" : "Explanation Overview"}
                                                        </Tag>
                                                    </Flex>

                                                    <Divider borderColor="gray.100" />

                                                    {/* Explanatory Context Field */}
                                                    {!isFlipped ? (
                                                        <Text color="gray.600" lineHeight="relaxed" fontSize="sm" minH="54px">
                                                            {item.explanation}
                                                        </Text>
                                                    ) : (
                                                        <VStack align="stretch" spacing={3} minH="54px" bg="gray.50" p={3} borderRadius="xl">
                                                            {item.examKeywords && (
                                                                <Box>
                                                                    <Text fontSize="xs" fontWeight="black" color="gray.500" textTransform="uppercase" mb={1.5} letterSpacing="wider">
                                                                        Target Exam Scoring Keywords
                                                                    </Text>
                                                                    <Flex gap={1.5} flexWrap="wrap">
                                                                        {item.examKeywords.map((kw: string, i: number) => (
                                                                            <Tag key={i} size="sm" colorScheme="teal" borderRadius="md" fontWeight="bold">
                                                                                <TagLabel>{kw}</TagLabel>
                                                                            </Tag>
                                                                        ))}
                                                                    </Flex>
                                                                </Box>
                                                            )}
                                                            {item.marksBoosterTip && (
                                                                <Box borderTop="1px dashed" borderColor="gray.200" pt={2}>
                                                                    <Text fontSize="xs" fontWeight="black" color="orange.600" textTransform="uppercase" mb={0.5} display="flex" alignItems="center" gap={1}>
                                                                        🚀 Strategic Marks Booster Point
                                                                    </Text>
                                                                    <Text fontSize="xs" color="gray.600" fontWeight="medium" lineHeight="normal">
                                                                        {item.marksBoosterTip}
                                                                    </Text>
                                                                </Box>
                                                            )}
                                                        </VStack>
                                                    )}
                                                </VStack>
                                            </Box>
                                        );
                                    })}
                                </SimpleGrid>

                                {/* Quick Recap Highlights System panel */}
                                {contentData.summary && (
                                    <Box
                                        mt={4} p={6}
                                        bgGradient="linear(to-br, white, gray.50)"
                                        borderRadius="2xl"
                                        border="1px solid"
                                        borderColor="gray.200"
                                        boxShadow="sm"
                                    >
                                        <HStack mb={3} spacing={2}>
                                            <Icon as={StarIcon} color="orange.400" w={4} h={4} />
                                            <Heading size="xs" textTransform="uppercase" tracking-space="wider" color="gray.700" fontWeight="black">
                                                Consolidated High-Yield Synthesis Summary
                                            </Heading>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.600" lineHeight="relaxed" fontWeight="medium">
                                            {contentData.summary}
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        )}

                        {/* 🧠 MIND MAP FLAT ASSET CODES VIEW */}
                        {contentType === "Mind Map" && (
                            <Box p={6} bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" boxShadow="sm">
                                <Heading size="sm" mb={4} color="gray.800" fontWeight="black">Structural Text Hierarchy Map</Heading>
                                <Box bg="gray.900" p={4} borderRadius="xl" overflowX="auto">
                                    <Text whiteSpace="pre-wrap" fontFamily="mono" color="emerald.300" fontSize="xs" lineHeight="relaxed">
                                        {contentData.mindMap}
                                    </Text>
                                </Box>
                            </Box>
                        )}

                        {/* 🌳 INTERACTIVE TREE GRAPH GRAPH VIEW PANEL */}
                        {contentType === "Mind Map2" && contentData.mindMap && (
                            <Box p={6} bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" boxShadow="sm" overflowX="auto">
                                <VStack align="start" spacing={1} mb={6}>
                                    <Heading size="sm" color="gray.800" fontWeight="black">Expandable Taxonomy Tree</Heading>
                                    <Text fontSize="xs" color="gray.500">Tap active colored root keys to collapse downstream branches dynamically.</Text>
                                </VStack>
                                <Box p={4} bg="gray.50" borderRadius="xl" border="1px solid" borderColor="gray.100" minH="300px">
                                    <MindMapNode node={parseMindMap(contentData.mindMap)} />
                                </Box>
                            </Box>
                        )}

                        {/* ⚡ REACT FLOW ENGINE CONTROLS LAYERING CHART */}
                        {contentType === "Flow Chart" && contentData?.mindMap && (
                            <Box
                                height="620px" w="100%"
                                borderWidth="1px" borderColor="gray.200" borderRadius="2xl"
                                bg="white" position="relative" boxShadow="sm" overflow="hidden"
                            >
                                <ReactFlowProvider>
                                    <ReactFlow
                                        nodes={flowData.nodes}
                                        edges={flowData.edges}
                                        nodeTypes={nodeTypes}
                                        fitView
                                        onInit={(instance) => setTimeout(() => instance.fitView(), 120)}
                                    >
                                        <Background variant={BackgroundVariant.Dots} color="#CBD5E0" gap={24} size={1} />
                                        <Controls style={{ borderRadius: '12px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                        <MiniMap
                                            nodeColor={(n) => n.data?.levelColor || "#cbd5e0"}
                                            maskColor="rgba(247, 250, 252, 0.8)"
                                            style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}
                                        />
                                    </ReactFlow>
                                    <FlowChartControlPanel />
                                </ReactFlowProvider>

                                <Box position="absolute" top={4} right={4} bg="rgba(255,255,255,0.9)" backdropFilter="blur(4px)" px={3} py={1.5} borderRadius="xl" border="1px solid" borderColor="gray.200" shadow="sm">
                                    <Text fontSize="11px" color="gray.600" fontWeight="bold">Infinite Canvas Sandbox: Drag & zoom to examine details</Text>
                                </Box>
                            </Box>
                        )}

                        {/* ❓ PRACTICE MCQS INTERACTIVE QUIZ ENGINE DESIGN */}
                        {contentType === "Question" && (
                            <VStack spacing={6} align="stretch" w="100%">
                                <VStack align="start" spacing={0} pb={2} borderBottom="1px solid" borderColor="gray.200">
                                    <Heading size="md" color="gray.800" fontWeight="black">Active Recall Knowledge Check</Heading>
                                    <Text fontSize="xs" color="gray.500">Select options below to score testing performance criteria dynamically metrics.</Text>
                                </VStack>

                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                    {contentData.questions?.map((q: any, index: number) => {
                                        const selectedOption = quizAnswers[index];
                                        const hasAnswered = selectedOption !== undefined;
                                        const isCorrect = selectedOption === q.answer;

                                        return (
                                            <Box
                                                key={index}
                                                bg="white" p={6} borderRadius="2xl"
                                                border="1px solid"
                                                borderColor={hasAnswered ? (isCorrect ? "green.200" : "red.200") : "gray.100"}
                                                boxShadow="sm"
                                                transition="all 0.2s"
                                                position="relative"
                                            >
                                                <VStack align="stretch" spacing={4}>
                                                    <HStack align="start" spacing={3}>
                                                        <Flex
                                                            bg={hasAnswered ? (isCorrect ? "green.500" : "red.500") : "blue.500"}
                                                            color="white" minW="28px" h="28px" borderRadius="lg" align="center" justify="center" fontSize="xs" fontWeight="black"
                                                        >
                                                            Q{index + 1}
                                                        </Flex>
                                                        <Text fontWeight="extrabold" fontSize="sm" color="gray.800" lineHeight="base">
                                                            {q.question}
                                                        </Text>
                                                    </HStack>

                                                    <VStack align="stretch" spacing={2.5} pt={2}>
                                                        {q.options.map((option: string, i: number) => {
                                                            const isSelected = selectedOption === option;
                                                            let optionBg = "gray.50";
                                                            let optionBorderColor = "gray.200";
                                                            let optionColor = "gray.700";

                                                            if (isSelected) {
                                                                if (isCorrect) {
                                                                    optionBg = "green.50";
                                                                    optionBorderColor = "green.500";
                                                                    optionColor = "green.700";
                                                                } else {
                                                                    optionBg = "red.50";
                                                                    optionBorderColor = "red.500";
                                                                    optionColor = "red.700";
                                                                }
                                                            } else if (hasAnswered && option === q.answer) {
                                                                // Highlight correct answer if student guessed wrong
                                                                optionBg = "green.50";
                                                                optionBorderColor = "green.300";
                                                            }

                                                            return (
                                                                <Flex
                                                                    key={i} align="center" px={4} py={3} borderRadius="xl" border="2px solid"
                                                                    borderColor={optionBorderColor} bg={optionBg} color={optionColor}
                                                                    cursor={hasAnswered ? "not-allowed" : "pointer"}
                                                                    fontWeight="semibold" fontSize="xs" transition="all 0.15s"
                                                                    onClick={() => !hasAnswered && handleSelectOption(index, option)}
                                                                    _hover={hasAnswered ? {} : { bg: "blue.50", borderColor: "blue.300" }}
                                                                >
                                                                    <Box mr={3} h="6px" w="6px" borderRadius="full" bg={isSelected ? "currentColor" : "gray.400"} />
                                                                    <Text flex={1}>{option}</Text>
                                                                </Flex>
                                                            );
                                                        })}
                                                    </VStack>

                                                    {/* Animated Dropdown Explanation feedback banner panel */}
                                                    <Collapse in={hasAnswered} animateOpacity>
                                                        <HStack p={3} borderRadius="xl" bg={isCorrect ? "green.50" : "red.50"} color={isCorrect ? "green.800" : "red.800"} fontSize="xs" fontWeight="bold" spacing={2} mt={2}>
                                                            <Icon as={isCorrect ? CheckCircleIcon : WarningIcon} />
                                                            <Text>
                                                                {isCorrect
                                                                    ? "Correct! You've mastered this insight asset milestone criterion."
                                                                    : `Incorrect. Expected core resolution target: ${q.answer}`}
                                                            </Text>
                                                        </HStack>
                                                    </Collapse>
                                                </VStack>
                                            </Box>
                                        );
                                    })}
                                </SimpleGrid>
                            </VStack>
                        )}

                        {/* 📊 VENN MATRIX ANALYSIS VIEWER PANEL */}
                        {contentType === "Venn Diagram" && (
                            <Box p={6} bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" boxShadow="sm" minH="500px">
                                <VStack align="stretch" spacing={2} mb={6} textAlign="center">
                                    <Heading size="sm" color="gray.800" fontWeight="black">Comparative Structural Venn Matrix</Heading>
                                    <Text fontSize="xs" color="gray.500">Visual overlap and differentiation between target contextual modules layout models.</Text>
                                </VStack>

                                {contentData?.vennDiagram ? (
                                    <Box p={4} bg="gray.50" borderRadius="xl">
                                        <VennView data={contentData.vennDiagram} />
                                    </Box>
                                ) : (
                                    <Flex align="center" justify="center" minH="300px" direction="column" gap={2}>
                                        <Text color="gray.400" fontSize="sm" fontWeight="bold">No Venn Diagram mapping registered for this chapter unit.</Text>
                                    </Flex>
                                )}
                            </Box>
                        )}
                    </div>
                )}
            </Box>

            {/* Hidden Target PDF Frame Layer Build Rendering Pipeline */}
            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div ref={pdfRef}>
                    <PdfLayout contentData={contentData} selectedChapter={selectedChapter} />
                </div>
            </div>
        </Box>
    );
};

export default FilterDetails;