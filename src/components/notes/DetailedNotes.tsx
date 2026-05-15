import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Box, Text, Flex, Badge, Stack, VStack, Divider } from '@chakra-ui/react';
import { getDetailedNotes } from '../../service/ApiNotes';

// REMOVED: import Note from 'mermaid/dist/dagre-wrapper/shapes/note.js'; 
import NoteSection from './NoteSection';
interface MCQ {
    question: string;
    options: string[];
    answer: string;
}

interface StructuredData {
    title: string | null;
    summary: string;
    study_notes: string[];
    mcqs: MCQ[] | null; // Critical: can be null
}
const DetailedNotes = () => {
    const [searchParams] = useSearchParams();

    // 1. Extract values from the URL
    const standard = searchParams.get('standard') || "";
    const subject = searchParams.get('subject') || "";
    const chapter = searchParams.get('chapter') || "";

    // 2. Setup TanStack Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['detailedNotes', standard, subject, chapter],
        queryFn: () => getDetailedNotes({
            classNumber: standard,
            subject: subject.toLowerCase(), // Use toLowerCase()
            chapterNumber: chapter
        }),
        enabled: !!standard && !!subject && !!chapter,
        placeholderData: (previousData) => previousData,
    });

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="50vh">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    if (isError) {
        return <Text color="red.500">Error: {error instanceof Error ? error.message : 'Unknown error'}</Text>;
    }

    return (
        <Box p={8} maxW="1200px" mx="auto">
            <Stack direction="row" align="center" mb={6}>
                <Text fontSize="3xl" fontWeight="extrabold" color="blue.800">
                    {subject} Notes
                </Text>
                <Badge colorScheme="blue" fontSize="md" px={3} borderRadius="full">
                    Class {standard}
                </Badge>
                <Badge colorScheme="purple" fontSize="md" px={3} borderRadius="full">
                    Chapter {chapter}
                </Badge>
            </Stack>

            <VStack spacing={12} align="stretch">
                {data?.map((chunk: any) => (
                    <Box key={chunk.id}>
                        <NoteSection noteData={chunk.structuredData} />
                        <Divider mt={10} />
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default DetailedNotes;
