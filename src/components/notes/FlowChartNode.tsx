import { Box, Text } from '@chakra-ui/react';
import { Handle, Position } from 'reactflow';

const FlowChartNode = ({ data }: { data: { label: string; levelColor?: string } }) => {
    return (
        <Box
            px={4}
            py={2}
            shadow="xl"
            borderRadius="full"
            bg="white"
            border="2px solid"
            borderColor={data.levelColor || "blue.400"}
            minW="150px"
            textAlign="center"
            position="relative"
        >
            {/* React Flow Handles (Connection Points) */}
            <Handle type="target" position={Position.Top} style={{ background: '#CBD5E0' }} />

            <Text fontWeight="bold" fontSize="sm" color="gray.700">
                {data.label}
            </Text>

            <Handle type="source" position={Position.Bottom} style={{ background: '#CBD5E0' }} />
        </Box>
    );
};

// Define this outside your component
export const nodeTypes = {
    custom: FlowChartNode,
};

export const buildFlow = (root: any) => {
    const nodes: any[] = [];
    const edges: any[] = [];
    let id = 0;

    const levelColors = ["#3182CE", "#38A169", "#805AD5", "#DD6B20", "#E53E3E"];

    const traverse = (node: any, x = 0, y = 0, parentId: any = null, level = 0) => {
        const currentId = `${id++}`;

        nodes.push({
            id: currentId,
            type: 'custom', // Use our custom node type
            data: {
                label: node.name,
                levelColor: levelColors[level % levelColors.length]
            },
            position: { x, y },
        });

        if (parentId !== null) {
            edges.push({
                id: `e-${parentId}-${currentId}`,
                source: parentId,
                target: currentId,
                animated: true,
                type: 'smoothstep',
                // Path styling
                style: {
                    stroke: levelColors[(level - 1) % levelColors.length],
                    strokeWidth: 3 // Slightly thicker for visibility
                },
                // Adding an arrow head
                markerEnd: {
                    type: 'arrowclosed',
                    color: levelColors[(level - 1) % levelColors.length],
                },
            });
        }

        if (node.children) {
            const totalWidth = node.children.length * 250;
            node.children.forEach((child: any, index: number) => {
                const childX = x - (totalWidth / 2) + (index * 250) + 125;
                traverse(child, childX, y + 150, currentId, level + 1);
            });
        }
    };

    traverse(root);
    return { nodes, edges };
};