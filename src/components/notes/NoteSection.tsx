import React, { useState } from 'react';
import {
    Box, Text, VStack, Heading, List, ListItem, ListIcon,
    SimpleGrid, Tag, Divider, Card, CardBody,
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Flex, Icon, Alert, AlertIcon, Button, Badge, HStack, Stack
} from '@chakra-ui/react';
import { MdCheckCircle, MdInfoOutline, MdQuestionAnswer, MdTimer, MdAutoStories } from 'react-icons/md';

// ... (Interfaces remain the same)

const NoteSection = ({ noteData }: { noteData: any }) => {
    const [revealedMcqs, setRevealedMcqs] = useState<number[]>([]);

    const toggleMcq = (index: number) => {
        setRevealedMcqs(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    };

    const content = React.useMemo(() => {
        try {
            return typeof noteData === 'string' ? JSON.parse(noteData) : noteData;
        } catch (e) { return null; }
    }, [noteData]);

    if (!content) return <Alert status="error"><AlertIcon />Failed to parse data</Alert>;

    return (
        <VStack spacing={10} align="stretch" w="100%" p={2}>

            {/* 1. HERO HEADER: Gradients attract attention */}
            <Box
                position="relative"
                p={8}
                borderRadius="3xl"
                bgGradient="linear(to-br, blue.600, purple.700)"
                color="white"
                boxShadow="xl"
                overflow="hidden"
            >
                {/* Decorative background circle */}
                <Box position="absolute" top="-20px" right="-20px" bg="whiteAlpha.200" borderRadius="full" boxSize="150px" />

                <HStack mb={4} spacing={3}>
                    <Badge colorScheme="whiteAlpha" borderRadius="full" px={3}>Science</Badge>
                    <HStack spacing={1}><Icon as={MdTimer} /><Text fontSize="xs">5 min read</Text></HStack>
                </HStack>

                <Heading size="xl" mb={4} fontWeight="extrabold" letterSpacing="tight">
                    {content.title || content.sectionTitle}
                </Heading>

                <Text fontSize="lg" opacity={0.9} lineHeight="tall" fontWeight="medium">
                    {content.summary}
                </Text>
            </Box>

            {/* 2. STUDY NOTES: Better visual separation */}
            <Box>
                <HStack mb={6}>
                    <Flex bg="purple.100" p={2} borderRadius="lg">
                        <Icon as={MdAutoStories} boxSize={6} color="purple.600" />
                    </Flex>
                    <Heading size="md" color="gray.800">Learning Pillars</Heading>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {content.study_notes?.map((note: any, index: number) => {
                        // Handle the case where AI returns an object instead of a string
                        const noteText = typeof note === 'string' ? note : (note.content ? note.content[0] : JSON.stringify(note));

                        return (
                            <Card
                                key={index}
                                variant="elevated"
                                borderRadius="2xl"
                                transition="all 0.3s"
                                _hover={{ transform: 'translateY(-5px)', shadow: 'xl', borderColor: 'purple.200' }}
                                border="1px solid"
                                borderColor="gray.100"
                            >
                                <CardBody>
                                    <HStack align="start" spacing={4}>
                                        <Icon as={MdCheckCircle} color="green.400" boxSize={5} mt={1} />
                                        <Text color="gray.700" fontSize="md" fontWeight="medium">
                                            {noteText}
                                        </Text>
                                    </HStack>
                                </CardBody>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* 3. QUIZ SECTION: Gamified Reveal Mechanism */}
            <Box bg="orange.50" p={8} borderRadius="3xl" border="2px dashed" borderColor="orange.200">
                <HStack mb={6} justify="space-between">
                    <HStack>
                        <Flex bg="orange.100" p={2} borderRadius="lg">
                            <Icon as={MdQuestionAnswer} boxSize={6} color="orange.600" />
                        </Flex>
                        <VStack align="start" spacing={0}>
                            <Heading size="md" color="orange.900">Knowledge Challenge</Heading>
                            <Text fontSize="xs" color="orange.700">Test your understanding</Text>
                        </VStack>
                    </HStack>
                    <Badge colorScheme="orange" variant="solid" borderRadius="lg">Bonus XP</Badge>
                </HStack>

                <VStack align="stretch" spacing={4}>
                    {content.mcqs?.map((mcq: any, index: number) => (
                        <Box key={index} bg="white" p={5} borderRadius="2xl" shadow="sm">
                            <Text fontWeight="bold" fontSize="md" mb={4} color="gray.800">
                                {index + 1}. {mcq.question}
                            </Text>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                                {mcq.options.map((opt: string, i: number) => {
                                    const isCorrect = opt === mcq.answer;
                                    const isRevealed = revealedMcqs.includes(index);

                                    return (
                                        <Box
                                            key={i}
                                            p={3}
                                            borderRadius="xl"
                                            fontSize="sm"
                                            border="2px solid"
                                            transition="0.2s"
                                            bg={isRevealed && isCorrect ? "green.50" : "gray.50"}
                                            borderColor={isRevealed && isCorrect ? "green.400" : "gray.100"}
                                            color={isRevealed && isCorrect ? "green.700" : "gray.600"}
                                        >
                                            {opt}
                                        </Box>
                                    );
                                })}
                            </SimpleGrid>

                            <Button
                                mt={4}
                                size="sm"
                                variant="ghost"
                                colorScheme="orange"
                                onClick={() => toggleMcq(index)}
                                leftIcon={<Icon as={MdInfoOutline} />}
                            >
                                {revealedMcqs.includes(index) ? "Hide Answer" : "Check Correct Answer"}
                            </Button>
                        </Box>
                    ))}
                </VStack>
            </Box>
        </VStack>
    );
};

export default NoteSection;