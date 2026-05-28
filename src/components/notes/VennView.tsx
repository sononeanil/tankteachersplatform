import React from "react";
import { Box, SimpleGrid, Text, Heading, VStack, UnorderedList, ListItem, Divider } from "@chakra-ui/react";

// 🎯 Match TypeScript types EXACTLY with your real API structure
interface VennDataPayload {
    conceptA: string;
    conceptB: string;
    uniqueA: string[];
    uniqueB: string[];
    common: string[];
}

interface VennDiagramViewProps {
    vennData?: VennDataPayload;
}

export const VennDiagramView: React.FC<VennDiagramViewProps> = React.memo(({ vennData }) => {
    // Defensive check to gracefully prevent application crashes if data is missing
    if (!vennData || !vennData.uniqueA || !vennData.uniqueB || !vennData.common) {
        return <Text textAlign="center" py={8} color="gray.500">No comparative analysis available for this section.</Text>;
    }

    return (
        <Box bg="white" p={{ base: 4, md: 8 }} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <Heading size="md" color="gray.800" mb={6} textAlign="center">
                Comparative Breakdown: {vennData.conceptA} vs {vennData.conceptB}
            </Heading>

            {/* 3-Column Split Deck Interface mimicking an interactive Venn breakdown on screen */}
            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} alignItems="stretch">

                {/* Column A: Unique to Left Concept */}
                <VStack
                    align="stretch"
                    p={5}
                    bg="blue.50"
                    borderRadius="xl"
                    borderTop="4px solid"
                    borderColor="blue.400"
                    spacing={3}
                >
                    <Heading size="xs" color="blue.700" textTransform="uppercase" letterSpacing="wider">
                        Only {vennData.conceptA}
                    </Heading>
                    <Divider borderColor="blue.200" />
                    <UnorderedList spacing={2.5} pl={4} fontSize="sm" color="gray.700">
                        {vennData.uniqueA.map((item, index) => (
                            <ListItem key={index} lineHeight="tall">{item}</ListItem>
                        ))}
                    </UnorderedList>
                </VStack>

                {/* Column B: Common Shared Core Overlaps */}
                <VStack
                    align="stretch"
                    p={5}
                    bg="purple.50"
                    borderRadius="xl"
                    borderTop="4px solid"
                    borderColor="purple.400"
                    spacing={3}
                >
                    <Heading size="xs" color="purple.700" textTransform="uppercase" letterSpacing="wider">
                        Shared Characteristics
                    </Heading>
                    <Divider borderColor="purple.200" />
                    <UnorderedList spacing={2.5} pl={4} fontSize="sm" color="gray.700" fontWeight="medium">
                        {vennData.common.map((item, index) => (
                            <ListItem key={index} lineHeight="tall">{item}</ListItem>
                        ))}
                    </UnorderedList>
                </VStack>

                {/* Column C: Unique to Right Concept */}
                <VStack
                    align="stretch"
                    p={5}
                    bg="orange.50"
                    borderRadius="xl"
                    borderTop="4px solid"
                    borderColor="orange.400"
                    spacing={3}
                >
                    <Heading size="xs" color="orange.700" textTransform="uppercase" letterSpacing="wider">
                        Only {vennData.conceptB}
                    </Heading>
                    <Divider borderColor="orange.200" />
                    <UnorderedList spacing={2.5} pl={4} fontSize="sm" color="gray.700">
                        {vennData.uniqueB.map((item, index) => (
                            <ListItem key={index} lineHeight="tall">{item}</ListItem>
                        ))}
                    </UnorderedList>
                </VStack>

            </SimpleGrid>
        </Box>
    );
});

VennDiagramView.displayName = "VennDiagramView";
export default VennDiagramView;