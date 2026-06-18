import React, { useMemo } from "react";
import { Box, Text, Heading, VStack, HStack, Icon, Circle, SimpleGrid, Badge, Flex } from "@chakra-ui/react";
import { FaGraduationCap, FaDotCircle, FaBookmark } from "react-icons/fa";

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
            if (!line.trim() || line.trim() === "mindmap") return;

            const leadingSpaces = line.search(/\S/);
            const level = Math.floor(leadingSpaces / 2);

            let cleanTitle = line.trim();
            cleanTitle = cleanTitle.replace(/^root\s*\(\((.*?)\)\)/, "$1");
            cleanTitle = cleanTitle.replace(/^\(\((.*?)\)\)/, "$1");

            const newNode: MindMapNode = { title: cleanTitle, level, children: [] };

            while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                stack.pop();
            }

            stack[stack.length - 1].children.push(newNode);
            stack.push(newNode);
        });

        return root.children[0] || null;
    }, [mindMapRawData]);

    // High-opacity, deeply vibrant color profiles built for high contrast and readability
    const branchThemes = [
        {
            bg: "linear-gradient(135deg, #DCEEFF 0%, #BEE3F8 100%)",
            border: "blue.500",
            text: "blue.900",
            accent: "blue.600",
            lightAccent: "blue.100",
            badgeColor: "blue"
        },
        {
            bg: "linear-gradient(135deg, #EBF4FF 0%, #E9D8FD 100%)",
            border: "purple.500",
            text: "purple.900",
            accent: "purple.600",
            lightAccent: "purple.100",
            badgeColor: "purple"
        },
        {
            bg: "linear-gradient(135deg, #E6FFFA 0%, #B2F5EA 100%)",
            border: "teal.500",
            text: "teal.900",
            accent: "teal.600",
            lightAccent: "teal.100",
            badgeColor: "teal"
        },
        {
            bg: "linear-gradient(135deg, #FFFAF0 0%, #FEEBC8 100%)",
            border: "orange.500",
            text: "orange.900",
            accent: "orange.600",
            lightAccent: "orange.100",
            badgeColor: "orange"
        },
    ];

    if (!treeData) {
        return (
            <Text textAlign="center" py={12} color="gray.400" fontStyle="italic">
                No Mind Map available for this chapter.
            </Text>
        );
    }

    return (
        <Box
            bg="linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)"
            p={{ base: 4, md: 6 }}
            borderRadius="3xl"
            boxShadow="inner"
            border="1px solid"
            borderColor="gray.200"
        >
            <VStack align="stretch" spacing={6}>
                {/* 🛠️ FIXED: Ultra-compact, ultra-high-contrast Header */}
                <Flex
                    direction="row"
                    align="center"
                    justify="space-between"
                    bg="white"
                    py={3}
                    px={5}
                    borderRadius="xl"
                    boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
                    border="2px solid"
                    borderColor="slate.200"
                    position="relative"
                    overflow="hidden"
                >
                    {/* Subtle micro gradient accent strip on the left edge to anchor it */}
                    <Box
                        position="absolute" left="0" top="0" bottom="0" w="6px"
                        bgGradient="linear(to-b, violet.500, blue.500)"
                    />

                    <HStack spacing={3} zIndex={1} w="100%">
                        <Circle size="36px" bg="blue.500" boxShadow="0px 2px 6px rgba(59, 130, 246, 0.4)">
                            <Icon as={FaGraduationCap} color="white" w={4} h={4} />
                        </Circle>
                        <VStack align="start" spacing={0} flex={1}>
                            <Text
                                color="blue.600"
                                fontSize="10px"
                                fontWeight="black"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                lineHeight="normal"
                            >
                                Active Mind Map
                            </Text>
                            {/* High Foreground Contrast Title */}
                            <Heading size="md" color="gray.900" fontWeight="black" letterSpacing="tight" lineHeight="short">
                                {treeData.title}
                            </Heading>
                        </VStack>
                    </HStack>
                </Flex>

                {/* Main Dynamic Branches Grid */}
                <VStack align="stretch" spacing={6}>
                    {treeData.children.map((branch, idx) => {
                        const theme = branchThemes[idx % branchThemes.length];
                        return (
                            <Box
                                key={idx}
                                p={{ base: 5, md: 6 }}
                                bg="white"
                                borderRadius="2xl"
                                border="2px solid"
                                borderColor="gray.100"
                                boxShadow="0px 10px 25px rgba(0, 0, 0, 0.03)"
                                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                _hover={{
                                    transform: "translateY(-4px) scale(1.005)",
                                    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.06)",
                                    borderColor: theme.accent
                                }}
                                position="relative"
                                overflow="hidden"
                            >
                                {/* Left Solid Neon Accent Indicator Bar */}
                                <Box position="absolute" left="0" top="0" bottom="0" w="6px" bg={theme.accent} />

                                {/* Interactive Header Strip */}
                                <Flex align="center" justify="space-between" wrap="wrap" gap={2} mb={5} pl={2}>
                                    <HStack spacing={3}>
                                        <Circle
                                            size="32px"
                                            bg={theme.accent}
                                            color="white"
                                            fontSize="xs"
                                            fontWeight="black"
                                            boxShadow={`0px 4px 10px rgba(0, 0, 0, 0.15)`}
                                        >
                                            {idx + 1}
                                        </Circle>
                                        <Text fontWeight="black" fontSize="md" color="gray.800" letterSpacing="tight">
                                            {branch.title}
                                        </Text>
                                    </HStack>
                                    <Badge
                                        colorScheme={theme.badgeColor}
                                        variant="solid"
                                        borderRadius="xl"
                                        px={2.5} py={0.5}
                                        fontSize="10px"
                                        fontWeight="bold"
                                    >
                                        {branch.children.length} Key Concepts
                                    </Badge>
                                </Flex>

                                {/* Nested Child Nodes Matrix */}
                                {branch.children.length > 0 && (
                                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4} pl={{ base: 2, md: 10 }}>
                                        {branch.children.map((leaf, leafIdx) => (
                                            <Box
                                                key={leafIdx}
                                                bg={theme.bg}
                                                p={4}
                                                borderRadius="xl"
                                                border="2px solid"
                                                borderColor={theme.border}
                                                boxShadow="md"
                                                transition="all 0.2s ease"
                                                _hover={{
                                                    bg: "white",
                                                    borderColor: theme.accent,
                                                    boxShadow: "lg",
                                                    transform: "translateY(-2px)"
                                                }}
                                            >
                                                <VStack align="start" spacing={3}>
                                                    <HStack spacing={2} align="start">
                                                        <Icon as={FaBookmark} color={theme.accent} w={3.5} h={3.5} mt="3px" flexShrink={0} />
                                                        <Text fontSize="sm" fontWeight="black" color={theme.text} letterSpacing="wide">
                                                            {leaf.title}
                                                        </Text>
                                                    </HStack>

                                                    {leaf.children.length > 0 && (
                                                        <VStack align="stretch" spacing={2} w="100%" pt={2} borderTop="2px dashed" borderColor={`${theme.accent}50`}>
                                                            {leaf.children.map((subLeaf, subIdx) => (
                                                                <HStack key={subIdx} spacing={2} align="start">
                                                                    <Icon as={FaDotCircle} color={theme.accent} w={2} h={2} mt="6px" flexShrink={0} />
                                                                    <Text fontSize="xs" color="gray.800" fontWeight="bold" lineHeight="short">
                                                                        {subLeaf.title}
                                                                    </Text>
                                                                </HStack>
                                                            ))}
                                                        </VStack>
                                                    )}
                                                </VStack>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                )}
                            </Box>
                        );
                    })}
                </VStack>
            </VStack>
        </Box>
    );
});

MindMapView.displayName = "MindMapView";
export default MindMapView;