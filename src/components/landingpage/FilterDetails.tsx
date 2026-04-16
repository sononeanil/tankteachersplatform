import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Text,
    Box,
    Select,
    Flex,
    Button
} from "@chakra-ui/react";
import { useState } from "react";
import {
    getChapterList,

    getChapterNotes
} from "../../service/ApiNotes";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";


const FilterDetails = () => {
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
    if (isLoading) return <Text>Loading chapters...</Text>;
    if (isError) return <Text>Error loading chapters</Text>;

    const parseMindMap = (text: string) => {
        const lines = text.split("\n").filter(Boolean);

        const root: any = { name: "Root", children: [] };
        const stack: any[] = [{ indent: -1, node: root }];

        lines.forEach((line) => {
            const trimmed = line.trim();

            if (trimmed === "mindmap" || /^\d+$/.test(trimmed)) return;

            const indent = line.search(/\S/);
            const newNode = { name: trimmed, children: [] };

            while (stack.length && indent <= stack[stack.length - 1].indent) {
                stack.pop();
            }

            stack[stack.length - 1].node.children.push(newNode);
            stack.push({ indent, node: newNode });
        });

        return root.children[0];
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


    const buildFlow = (root: any) => {
        const nodes: any[] = [];
        const edges: any[] = [];

        let id = 0;

        const traverse = (node: any, x = 0, y = 0, parentId: any = null) => {
            const currentId = `${id++}`;

            nodes.push({
                id: currentId,
                data: { label: node.name },
                position: { x, y },
                style: {
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    background: "#EDF2F7",
                },
            });

            if (parentId !== null) {
                edges.push({
                    id: `e-${parentId}-${currentId}`,
                    source: parentId,
                    target: currentId,
                });
            }

            node.children?.forEach((child: any, index: number) => {
                traverse(child, x + index * 200 - 100, y + 100, currentId);
            });
        };

        traverse(root);

        return { nodes, edges };
    };


    return (
        <Box p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                Selected: {decodedType}
            </Text>




            {/* 🎯 Content Type Buttons */}
            <Flex gap={3} mb={4}>
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
                {["Notes", "Mind Map", "Question", "Mind Map2", "Flow Chart"].map((item) => (
                    <Button
                        key={item}
                        onClick={() => setContentType(item)}
                        bg={contentType === item ? "blue.400" : "white"}
                        color={contentType === item ? "white" : "blue.600"}
                        borderRadius="full"
                        isDisabled={!selectedChapter}
                    >
                        {item}
                    </Button>
                ))}
            </Flex>

            <Box mt={4}>
                {contentLoading && <Text>Loading content...</Text>}

                {contentData && (
                    <>
                        {/* 📘 NOTES VIEW */}
                        {contentType === "Notes" && (
                            <Box>
                                {contentData.notes?.map((item: any, index: number) => (
                                    <Box
                                        key={index}
                                        p={4}
                                        mb={3}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        boxShadow="sm"
                                    >
                                        <Text fontWeight="bold" fontSize="md">
                                            {index + 1}. {item.note}
                                        </Text>
                                        <Text mt={2} color="gray.600">
                                            {item.explanation}
                                        </Text>
                                    </Box>
                                ))}

                                {/* 🧾 Summary */}
                                {contentData.summary && (
                                    <Box mt={5} p={4} bg="gray.50" borderRadius="md">
                                        <Text fontWeight="bold">Summary:</Text>
                                        <Text mt={2}>{contentData.summary}</Text>
                                    </Box>
                                )}
                            </Box>
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

                        {contentType === "Flow Chart" && contentData.mindMap && (() => {
                            const parsed = parseMindMap(contentData.mindMap);
                            const { nodes, edges } = buildFlow(parsed);

                            return (
                                <Box
                                    height="500px"
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    bg="gray.50"
                                >
                                    <ReactFlow nodes={nodes} edges={edges} fitView>
                                        <Background />
                                        <Controls />
                                    </ReactFlow>
                                </Box>
                            );
                        })()}

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
                    </>
                )}
            </Box>
        </Box>
    );
};


export default FilterDetails;