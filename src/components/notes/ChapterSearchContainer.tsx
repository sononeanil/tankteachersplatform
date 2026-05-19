import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Box, Flex, Input, Button, Text, VStack, Heading } from '@chakra-ui/react';
import SearchResultCard from './SearchResultCard';
import type { StudentQuestionType } from '../../types/notesType';
import { getAnswer } from '../../service/ApiNotes';

interface SearchProps {
    standard: string;
    subject: string;
    chapter: string;
}

const ChapterSearchContainer = ({ standard, subject, chapter }: SearchProps) => {
    const [typedQuery, setTypedQuery] = useState("");
    const [activeHighlightQuery, setActiveHighlightQuery] = useState("");

    const { mutate: fetchAnswer, data: answerList, isPending, isError, error } = useMutation({
        mutationFn: (payload: StudentQuestionType) => getAnswer(payload),
        onSuccess: () => {
            setActiveHighlightQuery(typedQuery);
        }
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!typedQuery.trim()) return;
        fetchAnswer({
            query: typedQuery,
            standard: standard,
            subject: subject.toLowerCase(),
            chapterNumber: chapter
        });
    };

    return (
        <Box bg="gray.50" p={6} borderRadius="2xl" border="1px solid" borderColor="blue.100" my={4}>
            <Heading size="sm" mb={3} color="blue.900">🔍 Ask a Question from this Chapter</Heading>

            <form onSubmit={handleSearchSubmit}>
                <Flex gap={3}>
                    <Input
                        placeholder="Type your question here..."
                        bg="white"
                        size="lg"
                        value={typedQuery}
                        onChange={(e) => setTypedQuery(e.target.value)}
                    />
                    <Button type="submit" colorScheme="blue" size="lg" px={8} isLoading={isPending}>
                        Search DB
                    </Button>
                </Flex>
            </form>

            {isError && (
                <Text color="red.500" mt={3} fontSize="sm">
                    ⚠️ {error instanceof Error ? error.message : 'Could not retrieve vector match results.'}
                </Text>
            )}

            {answerList && answerList.length > 0 && (
                <VStack mt={6} align="stretch" spacing={4}>
                    <Text fontWeight="bold" color="blue.700">🎯 Top Relevant Matches:</Text>

                    <VStack align="stretch" spacing={4}>
                        {answerList.map((match: any) => {
                            const parsedMatchData = typeof match.structuredData === 'string'
                                ? JSON.parse(match.structuredData)
                                : match.structuredData;

                            // --- CALIBRATED MCQ FILTER ---
                            // We check if it explicitly flags itself as an MCQ, 
                            // OR if it contains an options/choices array (the defining feature of an MCQ)
                            const isExplicitMcq =
                                parsedMatchData?.type?.toLowerCase() === 'mcq' ||
                                parsedMatchData?.contentType?.toLowerCase() === 'mcq' ||
                                parsedMatchData?.layout === 'mcq';

                            const hasMultipleChoices =
                                (Array.isArray(parsedMatchData?.options) && parsedMatchData.options.length > 0) ||
                                (Array.isArray(parsedMatchData?.choices) && parsedMatchData.choices.length > 0);

                            // If it passes either condition, skip it because it's an MCQ
                            if (isExplicitMcq || hasMultipleChoices) {
                                console.log("Filtered out MCQ item:", match.id);
                                return null;
                            }

                            // Regular notes, summaries, and standard Q&As will pass through safely here
                            return (
                                <SearchResultCard
                                    key={`match-${match.id}`}
                                    match={match}
                                    parsedMatchData={parsedMatchData}
                                    searchQuery={activeHighlightQuery}
                                />
                            );
                        })}
                    </VStack>
                </VStack>
            )}
        </Box>
    );
};

export default ChapterSearchContainer;