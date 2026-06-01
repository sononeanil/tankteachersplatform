import React, { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Textarea,
    VStack,
    Heading,
    useToast,
    HStack,
    Icon,
    Text,
} from "@chakra-ui/react";
import { AiOutlineSend, AiOutlineMail } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import { sendMessageToAdmin } from "../../service/ApiAdmin";
// Import your Axios function here (Adjust the path to match your project setup)


const SendMessageToAdmin = () => {
    const [message, setMessage] = useState("");
    const toast = useToast();

    const MAX_CHARACTERS = 250;
    const isOverLimit = message.length >= MAX_CHARACTERS;

    // TanStack Query Mutation Config
    const mutation = useMutation({
        mutationFn: (msg: string) => sendMessageToAdmin(msg),
        onSuccess: () => {
            toast({
                title: "Success!",
                description: "Your message has been sent to the admin.",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
            setMessage(""); // Clear the text area on success
        },
        onError: (error: any) => {
            toast({
                title: "Submission Failed",
                description: error.message || "Something went wrong. Please try again later.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            toast({
                title: "Error",
                description: "Please type a message before sending.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        if (isOverLimit) {
            toast({
                title: "Validation Error",
                description: "Your message must be less than 250 characters.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        // Fire the API call
        mutation.mutate(message);
    };

    return (
        <Box
            width="100%"
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
        >
            <VStack spacing={4} align="stretch" as="form" onSubmit={handleSubmit} width="100%">
                <HStack spacing={2} borderBottom="1px solid" borderColor="gray.100" pb={2} width="100%">
                    <Icon as={AiOutlineMail} color="blue.500" w={5} h={5} />
                    <Heading size="sm" color="gray.700">
                        Send a Message to Admin
                    </Heading>
                </HStack>

                <FormControl isRequired width="100%">
                    <HStack justify="space-between" mb={1}>
                        <FormLabel fontSize="xs" fontWeight="bold" color="gray.600" m={0}>
                            Message / Query / Feedback / Suggestion. Your voice matters!
                            You can ask for new notes, features and I will work on it
                        </FormLabel>
                        <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color={isOverLimit ? "red.500" : "gray.400"}
                        >
                            {message.length} / {MAX_CHARACTERS - 1} max
                        </Text>
                    </HStack>
                    <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        size="sm"
                        borderRadius="md"
                        focusBorderColor={isOverLimit ? "red.400" : "blue.400"}
                        isInvalid={isOverLimit}
                        rows={3}
                        resize="vertical"
                        width="100%"
                    />
                </FormControl>

                <Button
                    type="submit"
                    colorScheme={isOverLimit ? "gray" : "blue"}
                    size="sm"
                    isLoading={mutation.isPending} // Handled dynamically by TanStack Query
                    isDisabled={isOverLimit || !message.trim() || mutation.isPending}
                    loadingText="Sending..."
                    leftIcon={<AiOutlineSend />}
                    width={{ base: "100%", sm: "auto" }}
                    alignSelf={{ base: "stretch", sm: "flex-end" }}
                >
                    Send Message
                </Button>
            </VStack>
        </Box>
    );
};

export default SendMessageToAdmin;