import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Spinner, Button, VStack, Heading, Text, SimpleGrid, Divider } from '@chakra-ui/react';
import { getNotesBatchChapterDetails, getNotesBatchChapterList } from '../../service/ApiNotes';

const NotesBatchDetails = () => {
    const [searchParams] = useSearchParams();
    const standard = searchParams.get('standard') || "";
    const subject = searchParams.get('subject') || "";
    const [selectedChapterNum, setSelectedChapterNum] = useState<number | null>(null);

    // 1. Fetch Chapter List
    const {
        data: listData,
        isLoading: isListLoading,
        error: listError
    } = useQuery({
        queryKey: ['chapterList', standard, subject],
        queryFn: () => getNotesBatchChapterList(standard, subject),
        enabled: !!standard && !!subject, // Only run if params exist
    });

    // 2. Fetch Chapter Details (triggers when selectedChapterNum changes)
    const {
        data: detailsData,
        isFetching: isDetailsLoading
    } = useQuery({
        queryKey: ['chapterDetails', standard, subject, selectedChapterNum],
        queryFn: () => getNotesBatchChapterDetails(selectedChapterNum!),
        enabled: selectedChapterNum !== null,
    });

    if (isListLoading) return <Spinner />;
    if (listError) return <Text>Error loading chapters</Text>;

    return (
        <Box p={5}>
            <Heading size="md" mb={4}>Class {standard} - {subject}</Heading>

            {/* Chapter List Buttons */}
            <SimpleGrid columns={5} spacing={3} mb={10}>
                {listData?.chapterList?.map((item: { id: number, chapterNumber: number }) => (
                    <Button
                        key={item.id} // Use the real ID as key
                        colorScheme={selectedChapterNum === item.chapterNumber ? "blue" : "gray"}
                        onClick={() => setSelectedChapterNum(item.id)}
                    >
                        Ch {item.chapterNumber}
                    </Button>
                ))}
            </SimpleGrid>

            {/* Chapter Content */}
            {/* Chapter Content */}
            {isDetailsLoading ? (
                <Spinner />
            ) : detailsData?.chapterList && (
                <VStack align="stretch" spacing={5} mt={5}>
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
                        <Heading size="md" color="blue.600">Chapter {detailsData.chapterList.chapternumber} Summary</Heading>
                        <Text mt={2} fontStyle="italic">
                            {/* Your summary is coming as a string that looks like a set, let's clean it */}
                            {detailsData.chapterList.summary.replace(/{|}|"/g, '')}
                        </Text>

                        <Divider my={4} />

                        <Heading size="md" color="blue.600">Detailed Notes</Heading>
                        <Box mt={2} className="notes-content">
                            {/* Use whiteSpace="pre-wrap" to preserve the Markdown-like formatting */}
                            <Text whiteSpace="pre-wrap">{detailsData.chapterList.notes}</Text>
                        </Box>

                        {detailsData.chapterList.questions && (
                            <>
                                <Divider my={4} />
                                <Heading size="md" color="blue.600" mb={3}>Practice Questions</Heading>

                                <Text fontWeight="bold">Short Answer:</Text>
                                {detailsData.chapterList.questions.short?.map((q: string, i: number) => (
                                    <Text key={i} ml={4}>• {q}</Text>
                                ))}
                            </>
                        )}
                    </Box>
                </VStack>
            )}

        </Box>
    );
};
export default NotesBatchDetails;