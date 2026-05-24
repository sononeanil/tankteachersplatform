import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Box, Text, Flex, Badge, Stack, VStack, Divider, Heading } from '@chakra-ui/react';
import { getDetailedNotes } from '../../service/ApiNotes';
import NoteSection from './NoteSection';
import ChapterSearchContainer from './ChapterSearchContainer';

const DetailedNotes = () => {
    const [searchParams] = useSearchParams();

    const standard = searchParams.get('standard') || "";
    const subject = searchParams.get('subject') || "";
    const chapter = searchParams.get('chapter') || "";

    const { data: fullChapterNotes, isLoading, isError, error } = useQuery({
        queryKey: ['detailedNotes', standard, subject, chapter],
        queryFn: () => getDetailedNotes({
            classNumber: standard,
            // Try removing .toLowerCase() if your DB fields are capitalized!
            subject: subject.toLowerCase(),
            chapterNumber: chapter
        }),
        enabled: !!standard && !!subject && !!chapter,
    });



    return (
        <Box p={8} maxW="1200px" mx="auto">
            {/* Header Badge Row */}
            <Stack direction="row" align="center" mb={6}>
                <Text fontSize="3xl" fontWeight="extrabold" color="blue.800">
                    {subject} Notes
                </Text>
                <Badge colorScheme="blue" fontSize="md" px={3} borderRadius="full">Class {standard}</Badge>
                <Badge colorScheme="purple" fontSize="md" px={3} borderRadius="full">Chapter {chapter}</Badge>
            </Stack>

            {/* Independent Search Component Box */}
            <ChapterSearchContainer
                standard={standard}
                subject={subject}
                chapter={chapter}
            />

            <Divider my={8} />

            <Heading size="md" mb={6} color="blue.900">Complete Study Guide</Heading>

            {isLoading && (
                <Flex justify="center" align="center" minH="20vh">
                    <Spinner size="lg" color="blue.500" thickness="3px" />
                    <Text ml={3} color="gray.500">Loading full chapter notes...</Text>
                </Flex>
            )}

            {isError && (
                <Text color="red.500">
                    ⚠️ Error fetching study guide: {error instanceof Error ? error.message : 'Unknown error'}
                </Text>
            )}

            {/* CRITICAL FIX: Explicit check if the array came back empty */}
            {!isLoading && !isError && (!fullChapterNotes || fullChapterNotes.length === 0) && (
                <Box bg="orange.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="orange.400">
                    <Text color="orange.700" fontWeight="medium">
                        The backend API returned success, but found 0 notes matching:
                        Class "{standard}", Subject "{subject}", Chapter "{chapter}".
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                        Check if your database entries have exact matches for these strings (case-sensitive).
                    </Text>
                </Box>
            )}

            {/* Render loop */}
            {!isLoading && !isError && fullChapterNotes && fullChapterNotes.length > 0 && (
                <VStack spacing={12} align="stretch">
                    {fullChapterNotes.map((chunk: any) => {
                        const parsedData = typeof chunk.structuredData === 'string'
                            ? JSON.parse(chunk.structuredData)
                            : chunk.structuredData;

                        return (
                            <Box key={chunk.id}>
                                <NoteSection noteData={parsedData} />
                                <Divider mt={10} />
                            </Box>
                        );
                    })}
                </VStack>
            )}
        </Box>
    );
};

export default DetailedNotes;