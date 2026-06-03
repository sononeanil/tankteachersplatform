import React, { useState } from 'react';
import { Box, HStack, VStack, Text, Collapse, Icon, Flex, Circle, Badge, Heading } from '@chakra-ui/react';
import { FaChevronDown, FaFolder, FaFolderOpen, FaCube, FaGraduationCap } from 'react-icons/fa';

interface TreeNode {
    title: string;
    children?: TreeNode[];
}

interface TreeStructureViewProps {
    mindMapData: string;
}

// Internal markdown tree parser engine 
const parseTextToTree = (text: string): TreeNode => {
    if (!text) return { title: 'Root', children: [] };
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const root: any = { title: 'Root', children: [] };
    const stack: any[] = [root];

    lines.forEach((line) => {
        const indent = line.search(/\S/);
        const cleanText = line.trim().replace(/^(-\s*|\*\s*|root\s*|\(\(|\)\))/g, '');
        if (!cleanText) return;

        const node = { title: cleanText, children: [] };
        const depth = Math.floor(indent / 2) + 1;

        while (stack.length > depth) {
            stack.pop();
        }

        const parent = stack[stack.length - 1] || root;
        parent.children = parent.children || [];
        parent.children.push(node);
        stack.push(node);
    });

    return root.children[0] || root;
};

// Recursive Branch Node Render
const TreeBranch: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    // Rich structural themes per hierarchy layer
    const levelStyles = [
        {
            bg: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
            text: "white",
            badgeBg: "rgba(255, 255, 255, 0.2)",
            badgeText: "white",
            borderColor: "blue.400",
            icon: hasChildren ? (isOpen ? FaFolderOpen : FaFolder) : FaCube,
            fontWeight: "black",
            leafTextColor: "white"
        },
        {
            bg: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            text: "white",
            badgeBg: "purple.100",
            badgeText: "purple.800",
            borderColor: "purple.400",
            icon: hasChildren ? (isOpen ? FaFolderOpen : FaFolder) : FaCube,
            fontWeight: "extrabold",
            leafTextColor: "white"
        },
        {
            bg: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
            text: "white",
            badgeBg: "emerald.100",
            badgeText: "emerald.800",
            borderColor: "emerald.400",
            icon: hasChildren ? (isOpen ? FaFolderOpen : FaFolder) : FaCube,
            fontWeight: "bold",
            leafTextColor: "white"
        },
        {
            // 🛠️ CHANGED: Completely replaced the light brown/amber gradient layer with light sky-blue
            bg: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)",
            text: "white",
            badgeBg: "sky.100",
            badgeText: "sky.800",
            borderColor: "sky.300",
            icon: hasChildren ? (isOpen ? FaFolderOpen : FaFolder) : FaCube,
            fontWeight: "bold",
            leafTextColor: "white"
        }
    ];

    // 🛠️ CHANGED: Replaced the final non-expanding leaf background from sand/light-brown to a crisp, cool light blue slate tint
    const leafStyle = {
        bg: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)", // Beautiful soft solid light blue canvas box
        text: "sky.900",
        badgeBg: "sky.200",
        badgeText: "sky.900",
        borderColor: "sky.300",
        icon: FaCube,
        fontWeight: "semibold",
        leafTextColor: "sky.900"
    };

    const currentStyle = hasChildren
        ? (level < levelStyles.length ? levelStyles[level] : levelStyles[levelStyles.length - 1])
        : leafStyle;

    return (
        <VStack align="start" spacing={2} w="100%">
            <HStack
                p={3}
                bg={currentStyle.bg}
                borderRadius="xl"
                w="fit-content"
                maxW="100%"
                cursor={hasChildren ? "pointer" : "default"}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
                transition="all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)"
                _hover={hasChildren ? {
                    transform: "translateX(6px)",
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
                    filter: "brightness(1.05)"
                } : {}}
                boxShadow={hasChildren ? "sm" : "none"}
                border="1px solid"
                borderColor={currentStyle.borderColor}
                spacing={3}
            >
                {/* Expand / Collapse Indicator Chevron */}
                {hasChildren && (
                    <Icon
                        as={FaChevronDown}
                        w={3} h={3}
                        color={currentStyle.text}
                        transition="transform 0.2s ease"
                        transform={isOpen ? "rotate(0deg)" : "rotate(-90deg)"}
                    />
                )}

                {/* Layer Semantic Node Icon */}
                <Icon as={currentStyle.icon} color={hasChildren ? currentStyle.text : "sky.600"} w={3.5} h={3.5} />

                {/* Weight and color dynamically adapt depending on child status */}
                <Text
                    fontWeight={currentStyle.fontWeight}
                    fontSize="sm"
                    color={currentStyle.leafTextColor}
                    letterSpacing="wide"
                    whiteSpace="nowrap"
                >
                    {node.title}
                </Text>

                {/* Count Pill Box Badge */}
                {hasChildren && (
                    <Badge
                        bg={currentStyle.badgeBg}
                        color={currentStyle.badgeText}
                        borderRadius="md"
                        px={2} py={0.5}
                        fontSize="10px"
                        fontWeight="extrabold"
                    >
                        {node.children?.length}
                    </Badge>
                )}
            </HStack>

            {/* Hierarchical Child Render Block */}
            {hasChildren && (
                <Collapse in={isOpen} animateOpacity style={{ width: "100%" }}>
                    <VStack
                        align="start"
                        pl={{ base: 4, md: 6 }}
                        mt={1}
                        mb={2}
                        spacing={2}
                        borderLeft="2px dashed"
                        borderColor={currentStyle.borderColor}
                        ml={4}
                        w="100%"
                    >
                        {node.children?.map((child, idx) => (
                            <TreeBranch key={idx} node={child} level={level + 1} />
                        ))}
                    </VStack>
                </Collapse>
            )}
        </VStack>
    );
};

export const TreeStructureView: React.FC<TreeStructureViewProps> = ({ mindMapData }) => {
    const structuredTree = React.useMemo(() => parseTextToTree(mindMapData), [mindMapData]);

    return (
        <Box
            bg="linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)"
            p={{ base: 4, md: 6 }}
            borderRadius="3xl"
            boxShadow="inner"
            border="1px solid"
            borderColor="gray.200"
            overflowX="auto"
        >
            <VStack align="stretch" spacing={5}>
                {/* Compact Ultra-High-Contrast Header Component */}
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
                    borderColor="gray.200"
                    position="relative"
                    overflow="hidden"
                >
                    <Box
                        position="absolute" left="0" top="0" bottom="0" w="6px"
                        bgGradient="linear(to-b, blue.500, purple.500)"
                    />

                    <HStack spacing={3} zIndex={1} w="100%">
                        <Circle size="36px" bg="blue.600" boxShadow="0px 2px 6px rgba(37, 99, 235, 0.3)">
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
                                Structural Taxonomy
                            </Text>
                            <Heading size="md" color="gray.900" fontWeight="black" letterSpacing="tight" lineHeight="short">
                                {structuredTree.title}
                            </Heading>
                        </VStack>
                    </HStack>
                </Flex>

                {/* Sub-node Data Pipeline Context */}
                <VStack align="start" spacing={3} w="100%">
                    {structuredTree.children && structuredTree.children.length > 0 ? (
                        structuredTree.children.map((child, idx) => (
                            <TreeBranch key={idx} node={child} level={1} />
                        ))
                    ) : (
                        <TreeBranch node={structuredTree} level={0} />
                    )}
                </VStack>
            </VStack>
        </Box>
    );
};

export default TreeStructureView;