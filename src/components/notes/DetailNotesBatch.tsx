import React from 'react';
import { Form } from 'react-router-dom';
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        // Calls generateDetailedScienceNotes via your custom mutation hook
        mutate(data);
    };

    return (
        <Box maxW="500px" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="xl" boxShadow="lg">
            <VStack spacing={6}>
                <Heading size="lg">Generate Detailed Notes</Heading>

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
