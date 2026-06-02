import React, { useState } from 'react';
// ✅ FIXED: Removed 'Divider' from the imports list
import { Box, VStack, HStack, Text, Input, Button, Grid, GridItem, Collapse, Badge } from '@chakra-ui/react';

interface ExerciseItem {
    id: string;
    type: 'fill_in_the_blanks' | 'match_the_following' | 'descriptive';
    question: string;
    pairs?: { left: string; right: string }[];
    solutionKey?: string;
}

interface ChapterExerciseViewProps {
    exercises: ExerciseItem[];
}

export const ChapterExerciseView: React.FC<ChapterExerciseViewProps> = ({ exercises }) => {
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

    const handleTextChange = (id: string, value: string) => {
        setUserAnswers(prev => ({ ...prev, [id]: value }));
    };

    const toggleSolution = (id: string) => {
        setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!exercises || exercises.length === 0) {
        return <Text p={4} color="gray.500" textAlign="center">No traditional textbook exercises parsed for this chapter.</Text>;
    }

    return (
        <VStack spacing={6} align="stretch" w="100%">
            <Box bg="white" p={6} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
                <Text fontSize="xl" fontWeight="bold" mb={2} color="gray.800">
                    NCERT Textbook End-of-Chapter Exercises 📝
                </Text>
                <Text fontSize="sm" color="gray.500" mb={6}>
                    Test your core retention against standard physical board test configurations.
                </Text>

                <VStack spacing={6} align="stretch">
                    {exercises.map((ex, index) => (
                        <Box key={ex.id || index} p={5} borderRadius="xl" border="1px solid" borderColor="gray.100" bg="gray.50">
                            {/* Header Badge */}
                            <HStack mb={3}>
                                <Badge colorScheme={ex.type === 'descriptive' ? 'purple' : ex.type === 'match_the_following' ? 'orange' : 'teal'}>
                                    {ex.type.replace(/_/g, ' ').toUpperCase()}
                                </Badge>
                                <Text fontWeight="bold" fontSize="sm" color="gray.600">Question {index + 1}</Text>
                            </HStack>

                            <Text fontSize="md" fontWeight="medium" color="gray.800" mb={4}>
                                {ex.question}
                            </Text>

                            {/* CONDITIONAL COMPONENT STRATEGY BASED ON EXERCISE TYPE */}
                            {ex.type === 'fill_in_the_blanks' && (
                                <HStack maxW="400px" mt={2}>
                                    <Input
                                        placeholder="Type your fill answer here..."
                                        bg="white"
                                        borderRadius="xl"
                                        value={userAnswers[ex.id] || ''}
                                        onChange={(e) => handleTextChange(ex.id, e.target.value)}
                                    />
                                </HStack>
                            )}

                            {ex.type === 'match_the_following' && ex.pairs && (
                                <Grid templateColumns="repeat(2, 1fr)" gap={4} maxW="500px" my={4} bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200">
                                    <GridItem fontWeight="bold" color="gray.500" pb={2}>Column A</GridItem>
                                    <GridItem fontWeight="bold" color="gray.500" pb={2}>Column B</GridItem>
                                    {ex.pairs.map((pair, pIdx) => (
                                        <React.Fragment key={pIdx}>
                                            <GridItem py={1} fontSize="sm" fontWeight="semibold" color="gray.700">
                                                {pair.left}
                                            </GridItem>
                                            <GridItem py={1} fontSize="sm" color="gray.600" bg="amber.50" px={2} borderRadius="md" border="1px dashed" borderColor="orange.200">
                                                {pair.right}
                                            </GridItem>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            )}

                            {ex.type === 'descriptive' && (
                                <VStack align="stretch" spacing={3} mt={2}>
                                    <Button
                                        size="xs"
                                        colorScheme="blue"
                                        variant="outline"
                                        alignSelf="flex-start"
                                        borderRadius="md"
                                        onClick={() => toggleSolution(ex.id)}
                                    >
                                        {revealedSolutions[ex.id] ? "Hide Evaluator Answer Key 👁️" : "Show Evaluator Answer Key 👁️"}
                                    </Button>

                                    <Collapse in={revealedSolutions[ex.id]} animateOpacity>
                                        <Box p={4} bg="blue.50" borderLeft="4px solid" borderColor="blue.500" borderRadius="md">
                                            {/* ✅ FIXED: Changed 'uppercase' prop to 'textTransform="uppercase"' */}
                                            <Text fontSize="xs" fontWeight="bold" color="blue.700" textTransform="uppercase" mb={1}>
                                                Ideal Textbook Criteria Key:
                                            </Text>
                                            <Text fontSize="sm" color="gray.700" lineHeight="tall">
                                                {ex.solutionKey}
                                            </Text>
                                        </Box>
                                    </Collapse>
                                </VStack>
                            )}
                        </Box>
                    ))}
                </VStack>
            </Box>
        </VStack>
    );
};

export default ChapterExerciseView;