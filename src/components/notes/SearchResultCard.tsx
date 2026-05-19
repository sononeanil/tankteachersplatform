import React, { useState } from 'react';
import { Box, Flex, Text, Badge, Button, Collapse, HStack, List, ListItem, ListIcon } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from '@chakra-ui/icons';
import NoteSection from './NoteSection';
import HighlightText from './HighlightText';

interface SearchResultCardProps {
    match: any;
    parsedMatchData: any;
    searchQuery: string;
}

const SearchResultCard = ({ match, parsedMatchData, searchQuery }: SearchResultCardProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const resultTitle = parsedMatchData?.title || parsedMatchData?.topic || "Relevant Topic Match";
    const summaryPoints = parsedMatchData?.summaryPoints || parsedMatchData?.keyTakeaways || [];
    const previewText = parsedMatchData?.preview || parsedMatchData?.content || "";

    const rawScore = match?.score ?? match?.similarity ?? match?.distance;
    const matchScore = rawScore ? Math.round(rawScore <= 1 ? rawScore * 100 : rawScore) : null;

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="sm"
            transition="all 0.2s"
            _hover={{ boxShadow: "md", borderColor: "blue.300" }}
            p={5}
        >
            <Flex justify="space-between" align="center" mb={3}>
                <HStack spacing={2}>
                    <Badge colorScheme="blue" variant="subtle" px={2} py={0.5} borderRadius="md">
                        AI Excerpt
                    </Badge>
                    {matchScore !== null && !isNaN(matchScore) && (
                        <Badge colorScheme="green" variant="solid" px={2} py={0.5} borderRadius="md">
                            {matchScore}% Match
                        </Badge>
                    )}
                </HStack>
                <Text fontSize="xs" color="gray.400">ID: #{match?.id?.toString().substring(0, 5)}</Text>
            </Flex>

            {/* Title Highlight */}
            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={3}>
                <HighlightText text={resultTitle} searchQuery={searchQuery} />
            </Text>

            {/* Highlights in Body Content */}
            {summaryPoints.length > 0 ? (
                <List spacing={2} mb={4} ml={1}>
                    {summaryPoints.slice(0, 3).map((point: string, idx: number) => (
                        <ListItem key={idx} fontSize="sm" color="gray.600">
                            <ListIcon as={InfoIcon} color="blue.400" />
                            <HighlightText text={point} searchQuery={searchQuery} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Text fontSize="sm" color="gray.600" mb={4} noOfLines={4} lineHeight="tall">
                    <HighlightText text={previewText} searchQuery={searchQuery} />
                </Text>
            )}

            <Flex justify="space-between" align="center" pt={3} borderTop="1px dashed" borderColor="gray.100">
                <Text fontSize="xs" color="gray.500" fontStyle="italic">
                    Click expand to view textbook details
                </Text>
                <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "Hide Details" : "View Full Context"}
                </Button>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <Box mt={4} pt={4} borderTop="1px solid" borderColor="gray.200" bg="gray.50" p={4} borderRadius="md">
                    <NoteSection noteData={parsedMatchData} />
                </Box>
            </Collapse>
        </Box>
    );
};

export default SearchResultCard;