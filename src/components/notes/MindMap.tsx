import React, { useMemo } from "react";
import { Box, Text, Heading, VStack, HStack, Icon, Circle } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface MindMapViewProps {
    mindMapRawData?: string;
}

interface MindMapNode {
    title: string;
    level: number;
    children: MindMapNode[];
}

export const MindMapView: React.FC<MindMapViewProps> = React.memo(({ mindMapRawData }) => {
    // Parse the raw Mermaid mindmap string into a clean JSON tree
    const treeData = useMemo(() => {
        if (!mindMapRawData) return null;

        const lines = mindMapRawData.split("\n");
        const root: MindMapNode = { title: "Mind Map Root", level: -1, children: [] };
        const stack: MindMapNode[] = [root];

        lines.forEach((line) => {
            // Skip empty rows or the mermaid header declaration
            if (!line.trim() || line.trim() === "mindmap") return;

            // Measure indentation depth to determine hierarchical nesting level
            const leadingSpaces = line.search(/\S/);
            const level = Math.floor(leadingSpaces / 2);

            // Clean syntax markup strings like root((Title)) or text strings
            let cleanTitle = line.trim();
            cleanTitle = cleanTitle.replace(/^root\s*\(\((.*?)\)\)/, "$1"); // Strip root((...))
            cleanTitle = cleanTitle.replace(/^\(\((.*?)\)\)/, "$1");        // Strip ((...))

            const newNode: MindMapNode = { title: cleanTitle, level, children: [] };

            // Walk back up the tree stack to find the parent container node
            while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                stack.pop();
            }

            stack[stack.length - 1].children.push(newNode);
            stack.push(newNode);
        });

        return root.children[0] || null;
    }, [mindMapRawData]);

    if (!treeData) {
        return <Text textAlign="center" py={8} color="gray.500">No Mind Map available for this chapter.</Text>;
    }

    return (
        <Box bg="white" p={{ base: 4, md: 8 }} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" overflowX="auto">
            <VStack align="stretch" spacing={6}>
                {/* Chapter Main Root Hub Banner */}
                <Box bg="blue.500" color="white" p={5} borderRadius="xl" boxShadow="md" textAlign="center">
                    <Heading size="md">{treeData.title}</Heading>
                </Box>

                {/* Sub-categories Layout Core Grid Wrapper */}
                <VStack align="stretch" spacing={5} mt={2}>
                    {treeData.children.map((branch, idx) => (
                        <Box
                            key={idx}
                            p={4}
                            bg="gray.50"
                            borderRadius="xl"
                            borderLeft="5px solid"
                            borderColor={["blue.400", "purple.400", "teal.400", "orange.400"][idx % 4]}
                        >
                            {/* 🎯 FIXED: Replaced invalid align={Encoding.Center} with clean alignItems="center" */}
                            <Heading size="sm" color="gray.700" mb={3} display="flex" alignItems="center">
                                <Circle size="24px" bg={["blue.100", "purple.100", "teal.100", "orange.100"][idx % 4]} color={["blue.600", "purple.600", "teal.600", "orange.600"][idx % 4]} mr={2} fontSize="xs" fontWeight="bold">
                                    {idx + 1}
                                </Circle>
                                {branch.title}
                            </Heading>

                            {/* Leaf child nodes level looping block */}
                            {branch.children.length > 0 && (
                                <HStack wrap="wrap" gap={3} pl={6}>
                                    {branch.children.map((leaf, leafIdx) => (
                                        <Box key={leafIdx} bg="white" px={3} py={2} borderRadius="lg" border="1px solid" borderColor="gray.200" boxShadow="xs">
                                            <VStack align="start" spacing={1}>
                                                <Text fontSize="xs" fontWeight="bold" color="gray.600">
                                                    {leaf.title}
                                                </Text>
                                                {leaf.children.map((subLeaf, subIdx) => (
                                                    <HStack key={subIdx} spacing={1} pl={2}>
                                                        <Icon as={ChevronRightIcon} color="gray.400" w={3} h={3} />
                                                        <Text fontSize="11px" color="gray.500">{subLeaf.title}</Text>
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                    ))}
                                </HStack>
                            )}
                        </Box>
                    ))}
                </VStack>
            </VStack>
        </Box>
    );
});

MindMapView.displayName = "MindMapView";
export default MindMapView;