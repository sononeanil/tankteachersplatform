import React from 'react';
import {
    Box, Text, VStack, Heading, List, ListItem, ListIcon,
    SimpleGrid, Tag, Divider, Card, CardHeader, CardBody,
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Flex,
    Icon
} from '@chakra-ui/react';
import { MdCheckCircle, MdInfoOutline, MdQuestionAnswer } from 'react-icons/md';

const NoteSection = ({ noteData }: { noteData: any }) => {
    // Parse the JSON string if it's coming from your 'structuredData' field
    const content = typeof noteData === 'string' ? JSON.parse(noteData) : noteData;

    return (
        <VStack spacing={8} align="stretch" w="100%">
            {/* 1. Header & Summary */}
            <Box bg="blue.50" p={6} borderRadius="2xl" borderLeft="6px solid" borderColor="blue.400">
                <Heading size="lg" mb={3} color="blue.800">
                    {content.title}
                </Heading>
                <Text fontSize="md" color="gray.700" lineHeight="tall">
                    {content.summary}
                </Text>
            </Box>

            {/* 2. Study Notes (Bulleted List) */}
            <Box>
                <Flex align="center" mb={4}>
                    <Icon as={MdInfoOutline} boxSize={6} color="purple.500" mr={2} />
                    <Heading size="md" color="purple.800">Key Takeaways</Heading>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
                    {content.study_notes.map((note: string, index: number) => (
                        <Card key={index} variant="outline" borderRadius="xl" _hover={{ shadow: 'md' }}>
                            <CardBody>
                                <List spacing={3}>
                                    <ListItem display="flex">
                                        <ListIcon as={MdCheckCircle} color="green.500" mt={1} />
                                        <Text color="gray.700">{note}</Text>
                                    </ListItem>
                                </List>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            </Box>

            {/* 3. Quiz Section (Accordion for Interaction) */}
            <Box>
                <Flex align="center" mb={4}>
                    <Icon as={MdQuestionAnswer} boxSize={6} color="orange.500" mr={2} />
                    <Heading size="md" color="orange.800">Quick Check (MCQs)</Heading>
                </Flex>
                <Accordion allowToggle>
                    {content.mcqs.map((mcq: any, index: number) => (
                        <AccordionItem key={index} border="1px solid" borderColor="gray.100" borderRadius="lg" mb={3}>
                            <h2>
                                <AccordionButton _expanded={{ bg: 'orange.50' }} borderRadius="lg">
                                    <Box flex="1" textAlign="left" fontWeight="bold">
                                        Q{index + 1}: {mcq.question}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <VStack align="stretch" spacing={2}>
                                    {mcq.options.map((opt: string, i: number) => (
                                        <Box
                                            key={i}
                                            p={2}
                                            borderRadius="md"
                                            bg={opt === mcq.answer ? "green.50" : "gray.50"}
                                            border="1px solid"
                                            borderColor={opt === mcq.answer ? "green.200" : "gray.100"}
                                        >
                                            <Text fontSize="sm" color={opt === mcq.answer ? "green.700" : "gray.600"}>
                                                {opt} {opt === mcq.answer && "✓"}
                                            </Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Box>
        </VStack>
    );
};
export default NoteSection;