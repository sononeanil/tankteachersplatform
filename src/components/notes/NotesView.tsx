import React from "react";
import { Box, SimpleGrid, Text, Heading, Button, Flex, Badge, Wrap, WrapItem } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

interface NoteItem {
    note: string;
    explanation: string;
    examKeywords?: string[];
    marksBoosterTip?: string;
}

interface NotesViewProps {
    notes?: NoteItem[];
    readCards: Record<number, boolean>;
    onExplore: (index: number) => void;
}

export const NotesView: React.FC<NotesViewProps> = React.memo(({
    notes = [],
    readCards,
    onExplore
}) => {
    if (notes.length === 0) {
        return <Text textAlign="center" py={8} color="gray.500">No notes available for this chapter yet.</Text>;
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {notes.map((item, index) => {
                const isRead = !!readCards[index];

                return (
                    <Box
                        key={index}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        boxShadow="sm"
                        border="1px solid"
                        borderColor={isRead ? "green.200" : "gray.100"}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        transition="all 0.2s"
                        _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                    >
                        <Box>
                            <Flex justify="space-between" align="start" mb={3}>
                                {/* 🎯 FIX: API Key is item.note */}
                                <Heading size="md" color="gray.800">{item.note}</Heading>
                                {isRead && <CheckCircleIcon color="green.500" w={5} h={5} />}
                            </Flex>

                            {/* 🎯 FIX: API Key is item.explanation */}
                            <Text color="gray.600" fontSize="sm" lineHeight="tall" mb={4}>
                                {item.explanation}
                            </Text>

                            {/* Keywords Badges */}
                            {item.examKeywords && item.examKeywords.length > 0 && (
                                <Wrap spacing={1} mb={4}>
                                    {item.examKeywords.map((kw) => (
                                        <WrapItem key={kw}>
                                            <Badge colorScheme="blue" variant="subtle" px={2} py={0.5} borderRadius="md" fontSize="xs">
                                                {kw}
                                            </Badge>
                                        </WrapItem>
                                    ))}
                                </Wrap>
                            )}

                            {/* Marks Booster Box */}
                            {item.marksBoosterTip && (
                                <Box bg="purple.50" p={3} borderRadius="xl" borderLeft="4px solid" borderColor="purple.400" mb={4}>
                                    <Text fontSize="xs" color="purple.700" fontWeight="medium">
                                        <strong>Booster Tip:</strong> {item.marksBoosterTip}
                                    </Text>
                                </Box>
                            )}
                        </Box>

                        <Flex justify="flex-end" mt={2}>
                            <Button
                                size="xs"
                                colorScheme={isRead ? "green" : "blue"}
                                variant={isRead ? "subtle" : "solid"}
                                onClick={() => onExplore(index)}
                                isDisabled={isRead}
                                borderRadius="md"
                            >
                                {isRead ? "Completed (+10 XP)" : "Mark as Read"}
                            </Button>
                        </Flex>
                    </Box>
                );
            })}
        </SimpleGrid>
    );
});

NotesView.displayName = "NotesView";
export default NotesView;