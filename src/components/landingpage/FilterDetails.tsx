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
    Icon
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import {
    getChapterList,

    getChapterNotes
} from "../../service/ApiNotes";
import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider } from "reactflow";
import 'reactflow/dist/style.css';
import "reactflow/dist/style.css";
import html2pdf from "html2pdf.js";
import { toPng } from "html-to-image";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from "@chakra-ui/react";

import { PdfLayout } from "../notes/PdfLayout";
import { parseMindMap } from "../../service/ParseMindMap";
import VennView from "../notes/VennView";
import { buildFlow, nodeTypes } from "../notes/FlowChartNode";
import FlowChartControlPanel from "../notes/FlowChartControlPanel";
import { StarIcon } from "@chakra-ui/icons";



const FilterDetails = () => {
    const pdfRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { type } = useParams();
    const decodedType = type ? decodeURIComponent(type) : null;

    const [selectedChapter, setSelectedChapter] = useState("");
    const [contentType, setContentType] = useState("Notes");
    const queryClient = useQueryClient();

    const isCached = !!queryClient.getQueryData([
        "chapterContent",
        decodedType,
        selectedChapter,
    ]);



    // 🔹 First API → Get Chapters
    const {
        data: chapters,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["chapters", decodedType],
        queryFn: () => getChapterList({ key: decodedType! }),
        enabled: !!decodedType,
    });

    const {
        data: contentData,
        isFetching: contentLoading,
        refetch: fetchChapterDetails,
    } = useQuery({
        queryKey: ["chapterContent", decodedType, selectedChapter],
        queryFn: () =>
            getChapterNotes({
                key: decodedType!,
                chapter: selectedChapter,
            }),
        enabled: false,
        staleTime: Infinity, // 💥 cache forever (no refetch)
    });


    const flowData = useMemo(() => {
        if (contentType === "Flow Chart" && contentData?.mindMap) {
            const parsed = parseMindMap(contentData.mindMap);
            return buildFlow(parsed);
        }
        return { nodes: [], edges: [] };
    }, [contentData, contentType]);

    const opt = {
        margin: 0.5,
        filename: `${selectedChapter}-${contentType}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true
        },
        jsPDF: {
            unit: "in" as const,
            format: "a4" as const,
            orientation: "portrait" as const
        }
    };


    const handleDownloadPDFAll = () => {
        if (!pdfRef.current) return;

        const opt = {
            margin: 0.5,
            filename: `${decodedType}-Ch${selectedChapter}.pdf`,
            image: { type: "jpeg" as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: {
                unit: "in" as const,
                format: "a4" as const,
                orientation: "portrait" as const
            }
        };

        html2pdf().set(opt).from(pdfRef.current).save();
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
    <body style="text-align:center">
        <h2>${selectedChapter} - ${contentType}</h2>
        <img src="${dataUrl}" />
    </body>
    </html>
    `;

        const blob = new Blob([htmlContent], { type: "text/html" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedChapter}-${contentType}.html`;
        link.click();
    };


    const MindMapNode = ({ node, level = 0 }: any) => {
        const [open, setOpen] = useState(level < 2);

        const colors = [
            "blue.500",
            "green.500",
            "purple.500",
            "orange.500",
            "teal.500",
        ];

        return (
            <Box ml={level * 4} mt={3} position="relative">
                {/* 🌿 Connector Line */}
                {level > 0 && (
                    <Box
                        position="absolute"
                        left="-10px"
                        top="12px"
                        width="10px"
                        height="1px"
                        bg="gray.400"
                    />
                )}

                {/* 🧠 Node Card */}
                <Box
                    display="inline-block"
                    px={3}
                    py={2}
                    bg={colors[level % colors.length]}
                    color="white"
                    borderRadius="lg"
                    cursor="pointer"
                    boxShadow="md"
                    onClick={() => setOpen(!open)}
                    _hover={{ transform: "scale(1.05)" }}
                    transition="0.2s"
                >
                    {node.children?.length > 0 && (open ? "▼ " : "▶ ")}
                    {node.name}
                </Box>

                {/* 🌳 Children */}
                {open && node.children?.length > 0 && (
                    <Box
                        borderLeft="2px solid #CBD5E0"
                        ml={3}
                        pl={3}
                        mt={2}
                    >
                        {node.children.map((child: any, idx: number) => (
                            <MindMapNode
                                key={idx}
                                node={child}
                                level={level + 1}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        );
    };





    if (isLoading) return <Text>Loading chapters...</Text>;
    if (isError) return <Text>Error loading chapters</Text>;

    return (
        <Box p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                Selected: {decodedType}
            </Text>




            {/* 🎯 Content Type Buttons */}
            <Flex gap={3} mb={4} align="center" wrap="wrap">
                <Select
                    placeholder="Select Chapter"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    mb={4}
                >
                    {chapters?.map((ch: string) => (
                        <option key={ch} value={ch}>
                            Chapter {ch}
                        </option>
                    ))}

                </Select>
                <Button
                    colorScheme="teal"
                    onClick={() => fetchChapterDetails()}
                    isDisabled={!selectedChapter || isCached}
                >
                    {isCached ? "Loaded ✅" : "Fetch Details"}
                </Button>
                {["Notes", "Mind Map", "Question", "Mind Map2", "Flow Chart", "Venn Diagram"].map((item) => (
                    <Button
                        key={item}
                        onClick={() => setContentType(item)}
                        colorScheme={contentType === item ? "blue" : "gray"}
                        variant={contentType === item ? "solid" : "outline"}
                        borderColor={contentType === item ? "blue.600" : "gray.500"}
                        borderRadius="full"
                        isDisabled={!selectedChapter}
                        boxShadow="xl"
                    >
                        {item}
                    </Button>
                ))}

                <Menu>
                    <MenuButton as={Button} colorScheme="purple">
                        Download ⬇️
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={handleDownloadPDF}>PDF Single Page</MenuItem>
                        <MenuItem onClick={handleDownloadPDFAll}>PDF Complete Chapter</MenuItem>
                        <MenuItem onClick={handleDownloadHTML}>HTML</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            <Box mt={4}>
                {contentLoading && <Text>Loading content...</Text>}

                {contentData && (
                    <div ref={contentRef}>

                        {/* 📘 NOTES VIEW */}

                        {contentType === "Notes" && (
                            <VStack spacing={6} align="stretch" w="100%">
                                {/* Header Section */}
                                <HStack justify="space-between" pb={2} borderBottom="2px solid" borderColor="blue.500">
                                    <Heading size="lg" color="gray.700">Chapter Insights</Heading>
                                    <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                                        {contentData.notes?.length} Key Points
                                    </Badge>
                                </HStack>

                                {/* Notes Grid/List */}
                                <Box>
                                    {contentData.notes?.map((item: any, index: number) => (
                                        <Box
                                            key={index}
                                            position="relative"
                                            p={6}
                                            mb={5}
                                            bg="white"
                                            borderRadius="xl"
                                            borderWidth="1px"
                                            borderColor="gray.100"
                                            boxShadow="sm"
                                            transition="all 0.2s"
                                            _hover={{
                                                boxShadow: "xl",
                                                transform: "translateY(-2px)",
                                                borderColor: "blue.200"
                                            }}
                                        >
                                            {/* Decorative Side Bar */}
                                            <Box
                                                position="absolute"
                                                left={0}
                                                top={0}
                                                bottom={0}
                                                w="4px"
                                                bgGradient="linear(to-b, blue.400, purple.500)"
                                                borderTopLeftRadius="xl"
                                                borderBottomLeftRadius="xl"
                                            />

                                            <HStack spacing={4} align="flex-start">
                                                <Box
                                                    bg="blue.50"
                                                    color="blue.600"
                                                    borderRadius="full"
                                                    p={2}
                                                    minW="40px"
                                                    textAlign="center"
                                                    fontWeight="bold"
                                                >
                                                    {index + 1}
                                                </Box>

                                                <VStack align="start" spacing={2}>
                                                    <Text fontWeight="extrabold" fontSize="lg" color="gray.800">
                                                        {item.note}
                                                    </Text>
                                                    <Divider />
                                                    <Text color="gray.600" lineHeight="tall" fontSize="md">
                                                        {item.explanation}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    ))}
                                </Box>

                                {/* 🧾 Enhanced Summary Section */}
                                {contentData.summary && (
                                    <Box
                                        mt={8}
                                        p={8}
                                        bgGradient="linear(to-br, gray.50, white)"
                                        borderRadius="2xl"
                                        borderWidth="1px"
                                        borderStyle="dashed"
                                        borderColor="gray.300"
                                        position="relative"
                                    >
                                        <HStack mb={4}>
                                            <Icon as={StarIcon} color="orange.400" />
                                            <Heading size="md" color="gray.700">Quick Recap</Heading>
                                        </HStack>
                                        <Text fontSize="lg" color="gray.700" fontStyle="italic" letterSpacing="wide">
                                            "{contentData.summary}"
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        )}

                        {/* 🧠 MIND MAP VIEW */}
                        {contentType === "Mind Map" && (
                            <Box p={4} borderWidth="1px" borderRadius="md">
                                <Text fontWeight="bold" mb={2}>
                                    Mind Map
                                </Text>
                                <Text whiteSpace="pre-wrap" fontFamily="monospace">
                                    {contentData.mindMap}
                                </Text>
                            </Box>
                        )}

                        {contentType === "Mind Map2" && contentData.mindMap && (
                            <Box
                                p={5}
                                borderWidth="1px"
                                borderRadius="xl"
                                bg="gray.50"
                                overflowX="auto"
                            >
                                <Text fontWeight="bold" mb={3}>
                                    Mind Map
                                </Text>

                                <MindMapNode node={parseMindMap(contentData.mindMap)} />
                            </Box>
                        )}


                        {contentType === "Flow Chart" && contentData?.mindMap && (
                            <Box
                                height="600px"
                                width="100%"
                                borderWidth="1px"
                                borderRadius="2xl"
                                bg="gray.50"
                                position="relative"
                                boxShadow="inner"
                                overflow="hidden"
                            >
                                {/* 1. Wrap everything in the Provider */}
                                <ReactFlowProvider>

                                    <ReactFlow
                                        nodes={flowData.nodes}
                                        edges={flowData.edges}
                                        nodeTypes={nodeTypes}
                                        fitView
                                        onInit={(instance) => setTimeout(() => instance.fitView(), 100)}
                                    >
                                        <Background variant={BackgroundVariant.Lines} color="#E2E8F0" gap={20} />
                                        <Controls style={{ borderRadius: '10px', overflow: 'hidden' }} />
                                        <MiniMap
                                            nodeColor={(n) => n.data.levelColor}
                                            maskColor="rgba(247, 250, 252, 0.7)"
                                            style={{ borderRadius: '10px' }}
                                        />
                                    </ReactFlow>

                                    {/* 2. Place your custom ControlPanel inside the Provider, 
                   but outside the ReactFlow component itself so it floats */}
                                    <FlowChartControlPanel />

                                </ReactFlowProvider>

                                {/* Floating Legend */}
                                <Box position="absolute" top={4} right={4} bg="whiteAlpha.800" p={2} borderRadius="md" shadow="sm">
                                    <Text fontSize="xs" color="gray.500" fontWeight="bold">Interactive View: Drag to explore</Text>
                                </Box>
                            </Box>
                        )}

                        {/* ❓ QUESTIONS VIEW */}
                        {contentType === "Question" && (
                            <Box>
                                {contentData.questions?.map((q: any, index: number) => (
                                    <Box
                                        key={index}
                                        p={4}
                                        mb={4}
                                        borderWidth="1px"
                                        borderRadius="md"
                                    >
                                        <Text fontWeight="bold">
                                            Q{index + 1}. {q.question}
                                        </Text>

                                        {q.options.map((opt: string, i: number) => (
                                            <Text key={i} ml={4}>
                                                • {opt}
                                            </Text>
                                        ))}

                                        <Text mt={2} color="green.600">
                                            ✅ Answer: {q.answer}
                                        </Text>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* 📊 VENN DIAGRAM VIEW */}
                        {contentType === "Venn Diagram" && (
                            <Box
                                p={5}
                                borderWidth="1px"
                                borderRadius="xl"
                                bg="white"
                                boxShadow="inner"
                                minH="500px"
                            >
                                <Text fontWeight="bold" fontSize="xl" mb={5} textAlign="center">
                                    Comparison Diagram
                                </Text>

                                {contentData?.vennDiagram ? (
                                    <VennView data={contentData.vennDiagram} />
                                ) : (
                                    <Text color="red.500" textAlign="center">
                                        No Venn Diagram data available for this chapter.
                                    </Text>
                                )}
                            </Box>
                        )}

                    </div>
                )}
            </Box>
            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div ref={pdfRef}>
                    <PdfLayout
                        contentData={contentData}
                        selectedChapter={selectedChapter}
                    />
                </div>
            </div>
        </Box>
    );
};


export default FilterDetails;