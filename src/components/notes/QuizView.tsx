import React from "react";
import { Box, Text, Heading, Stack, Button, Flex } from "@chakra-ui/react";

interface QuestionItem {
    question: string;
    options: string[];
    answer: string;
}

interface QuizViewProps {
    questions?: QuestionItem[];
    quizAnswers: Record<number, string>;
    onAnswer: (qIndex: number, option: string, isCorrect: boolean) => void;
}

export const QuizView: React.FC<QuizViewProps> = React.memo(({
    questions = [],
    quizAnswers,
    onAnswer
}) => {
    if (questions.length === 0) {
        return <Text textAlign="center" py={8} color="gray.500">No practice questions discovered for this topic.</Text>;
    }

    return (
        <Stack spacing={6}>
            {questions.map((q, qIndex) => {
                const selectedOption = quizAnswers[qIndex];
                const isAnswered = !!selectedOption;

                return (
                    <Box
                        key={qIndex}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.100"
                    >
                        <Heading size="sm" color="gray.700" mb={4} lineHeight="base">
                            {qIndex + 1}. {q.question}
                        </Heading>

                        <Stack spacing={3}>
                            {q.options.map((option) => {
                                const isCurrentSelection = selectedOption === option;
                                const isCorrectOption = option === q.answer;

                                let variant = "outline";
                                let colorScheme = "gray";

                                // 🎯 Setup explicitly forced style maps to override Chakra defaults
                                let disabledBg = undefined;
                                let disabledColor = undefined;
                                let disabledBorderColor = "transparent";

                                if (isAnswered) {
                                    if (isCorrectOption) {
                                        variant = "solid";
                                        colorScheme = "green";
                                        disabledBg = "green.500";
                                        disabledColor = "white";
                                    } else if (isCurrentSelection) {
                                        variant = "solid";
                                        colorScheme = "red";
                                        disabledBg = "red.500";
                                        disabledColor = "white";
                                    } else {
                                        // Rest of the unselected options look visually generic
                                        variant = "outline";
                                        colorScheme = "gray";
                                        disabledBg = "gray.50";
                                        disabledColor = "gray.400";
                                        disabledBorderColor = "gray.200";
                                    }
                                } else {
                                    colorScheme = "blue";
                                }

                                return (
                                    <Button
                                        key={option}
                                        variant={variant}
                                        colorScheme={colorScheme}
                                        isDisabled={isAnswered}
                                        onClick={() => onAnswer(qIndex, option, option === q.answer)}
                                        justifyContent="flex-start"
                                        py={5}
                                        px={4}
                                        borderRadius="xl"
                                        whiteSpace="normal"
                                        textAlign="left"
                                        h="auto"
                                        fontSize="sm"
                                        transition="all 0.2s"

                                        // 🎯 THE FIX: Force color states to persist even when disabled
                                        _disabled={{
                                            bg: disabledBg,
                                            color: disabledColor,
                                            borderColor: disabledBorderColor,
                                            opacity: 1, // Prevents elements from fading out
                                            cursor: "not-allowed",
                                        }}
                                        _hover={!isAnswered ? { bg: "blue.50", borderColor: "blue.300" } : {}}
                                    >
                                        {option}
                                    </Button>
                                );
                            })}
                        </Stack>

                        {isAnswered && (
                            <Flex justify="space-between" align="center" mt={4} pt={2} borderTop="1px solid" borderColor="gray.50">
                                <Text fontSize="xs" color="gray.500">
                                    Correct Answer: <Text as="span" fontWeight="bold" color="green.600">{q.answer}</Text>
                                </Text>
                                <Text fontSize="xs" fontWeight="bold" color={selectedOption === q.answer ? "green.600" : "red.600"}>
                                    {selectedOption === q.answer ? "Correct Choice! 🔥 (+50 XP)" : `Incorrect Choice (+15 XP)`}
                                </Text>
                            </Flex>
                        )}
                    </Box>
                );
            })}
        </Stack>
    );
});

QuizView.displayName = "QuizView";
export default QuizView;