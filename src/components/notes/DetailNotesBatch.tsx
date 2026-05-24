import { Form } from 'react-router-dom';
import React from 'react'; // 1. Added React import for FormEvent typing
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Stack,
    VStack,
} from '@chakra-ui/react';
import { useInitiateDetailedNotesBatch } from '../../tanstack/detailedNotesTanstack';

const DetailNotesBatch = () => {
    const { mutate, isPending } = useInitiateDetailedNotesBatch();

    // 2. Added explicit React.FormEvent typing to prevent implicit 'any' error
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        // 3. Note: If your custom mutation expects 'NoteParams' strictly (e.g. numbers),
        // you may need to cast it or map it: mutate(data as any); 
        mutate(data as any);
    };

    return (
        <Box maxW="500px" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="xl" boxShadow="lg">
            <VStack spacing={6}>
                <Heading size="lg">Generate Detailed Notes</Heading>

                {/* CRITICAL FIX: Changed 'met' to 'method' */}
                <Form method="post" onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Stack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel>Class Number</FormLabel>
                            <Select name="classNumber" placeholder="Select class">
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Subject</FormLabel>
                            <Select name="subject" placeholder="Select subject">
                                <option value="science">Science</option>
                                <option value="English">English</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Chapter Number</FormLabel>
                            <Input
                                name="chapterNumber"
                                type="number"
                                placeholder="Enter chapter number"
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            w="full"
                            isLoading={isPending}
                            loadingText="Generating..."
                        >
                            Generate Notes
                        </Button>
                    </Stack>
                </Form>
            </VStack>
        </Box>
    );
};

export default DetailNotesBatch;