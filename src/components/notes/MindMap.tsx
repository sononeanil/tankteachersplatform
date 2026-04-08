import React, { useEffect, useRef } from 'react';
import { Box, Heading, Center } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom'; // 👈 Import this
import mermaid from 'mermaid';

interface MindMapProps {
    chartCode?: string; // 👈 Make this optional with '?'
}

const MindMap: React.FC<MindMapProps> = ({ chartCode }) => {
    const location = useLocation();
    const ref = useRef<HTMLDivElement>(null);

    // ✅ Get code from Props OR from Navigation State
    const finalCode = chartCode || (location.state as any)?.mindMap;

    useEffect(() => {
        console.log("MindMap finalCode:", finalCode);

        if (ref.current && finalCode) {
            ref.current.innerHTML = "";
            ref.current.removeAttribute('data-processed');

            try {
                // Use a dynamic ID to prevent collisions
                mermaid.render(`mermaid-svg-${Math.random().toString(36).substr(2, 9)}`, finalCode)
                    .then((result) => {
                        if (ref.current) {
                            ref.current.innerHTML = result.svg;
                        }
                    });
            } catch (error) {
                console.error("Mermaid Render Error:", error);
            }
        }
    }, [finalCode]);

    if (!finalCode) {
        return <Center p={10}>No mind map data available. Please select a chapter.</Center>;
    }

    return (
        <Box p={5} bg="white" borderRadius="xl" minH="500px" shadow="sm">
            <Heading size="md" mb={4}>Visual Mind Map</Heading>
            <Box ref={ref} border="1px solid #eee" p={4} borderRadius="md" bg="gray.50" />
        </Box>
    );
};

export default MindMap;
