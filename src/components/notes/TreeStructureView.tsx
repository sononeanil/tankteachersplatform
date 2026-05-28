import React, { useState } from 'react';
import { Box, HStack, VStack, Text, Collapse } from '@chakra-ui/react';

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

    // 🎯 DIALED UP CONTRAST: Deep, vibrant solid colors with white text
    const levelStyles = [
        { bg: "blue.600", text: "white", badgeColor: "blue.200" },
        { bg: "green.600", text: "white", badgeColor: "green.200" },
        { bg: "purple.600", text: "white", badgeColor: "purple.200" },
        { bg: "orange.600", text: "white", badgeColor: "orange.200" },
        { bg: "red.600", text: "white", badgeColor: "red.200" }
    ];

    const currentStyle = levelStyles[level % levelStyles.length];

    return (
        <VStack align="stretch" spacing={2} w="100%" position="relative">
            <HStack
                p={3}
                bg={currentStyle.bg}
                borderRadius="xl"
                cursor={hasChildren ? "pointer" : "default"}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
                transition="all 0.2s"
                _hover={hasChildren ? { transform: "translateX(6px)", filter: "brightness(1.1)", boxShadow: "md" } : {}}
                shadow="md"
            >
                {hasChildren && (
                    <Text fontSize="xs" color={currentStyle.text} fontWeight="bold" mr={1}>
                        {isOpen ? "▼" : "▶"}
                    </Text>
                )}
                <Text fontWeight="bold" fontSize="sm" color={currentStyle.text}>
                    {node.title}
                </Text>
                {hasChildren && (
                    <Text fontSize="xs" color={currentStyle.badgeColor} fontWeight="semibold" ml="auto">
                        {node.children?.length} items
                    </Text>
                )}
            </HStack>

            {hasChildren && (
                <Collapse in={isOpen} animateOpacity>
                    <VStack
                        align="stretch"
                        pl={{ base: 4, md: 6 }} // Creates the structured hierarchy indentation
                        mt={2}
                        spacing={2}
                        borderLeft="2px solid"
                        borderColor="gray.300" // Made the nesting line darker and solid too
                        ml={3}
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
        <Box bg="white" p={6} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="md">
            <Text fontSize="lg" fontWeight="bold" mb={5} color="gray.800">
                Chapter Taxonomy Outline Tree 🌲
            </Text>
            <VStack align="stretch" spacing={3}>
                <TreeBranch node={structuredTree} level={0} />
            </VStack>
        </Box>
    );
};

export default TreeStructureView;