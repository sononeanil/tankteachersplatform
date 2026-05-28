import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import { Box, Text } from '@chakra-ui/react';

// ⚠️ CRITICAL: Standard layout stylesheets must be declared or lines will visually break!
import 'reactflow/dist/style.css';

import { buildFlow, nodeTypes } from './FlowChartNode';
import FlowChartControlPanel from './FlowChartControlPanel';

interface FlowChartViewProps {
    mindMapData: string; // Accepts the raw markdown/mermaid string directly from backend
}

// 🎯 Simple parser utility to transform a text layout tree into a node branch structure
const parseTextToTree = (text: string) => {
    if (!text) return null;
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

// Internal execution viewport scope running securely below the context provider
const FlowCanvasContextInner: React.FC<{ nodes: any[]; edges: any[] }> = ({ nodes, edges }) => {
    return (
        <Box
            w="100%"
            h="600px"
            bg="gray.50"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            overflow="hidden"
            position="relative"
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={1.5}
            >
                <Background color="#CBD5E0" gap={16} />
                <Controls style={{ borderRadius: '8px', overflow: 'hidden' }} />
                <MiniMap
                    nodeColor={(node: any) => node.data?.levelColor || '#3182CE'}
                    maskColor="rgba(247, 250, 252, 0.7)"
                />

                {/* 🎯 SAFE: Rendered inside the context scope to prevent active hook failure loops */}
                <FlowChartControlPanel />
            </ReactFlow>
        </Box>
    );
};

export const FlowChartView: React.FC<FlowChartViewProps> = React.memo(({ mindMapData }) => {
    const { nodes, edges } = useMemo(() => {
        if (!mindMapData) return { nodes: [], edges: [] };
        const standardTree = parseTextToTree(mindMapData);
        return buildFlow(standardTree);
    }, [mindMapData]);

    if (nodes.length === 0) {
        return <Text textAlign="center" py={8} color="gray.500">No layout tracks found for this flowchart layout.</Text>;
    }

    return (
        <ReactFlowProvider>
            <FlowCanvasContextInner nodes={nodes} edges={edges} />
        </ReactFlowProvider>
    );
});

FlowChartView.displayName = "FlowChartView";
export default FlowChartView;