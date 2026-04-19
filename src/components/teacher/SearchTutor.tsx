import React, { useState } from 'react';
import {
    Box,
    Input,
    Button,
    VStack,
    Text,
    InputGroup,
    InputLeftElement,
    Icon,
    useColorModeValue,
    Container,
    Heading,
    Skeleton,
    Stack,
    Badge,
    HStack,
} from '@chakra-ui/react';
import { IoSparkles } from 'react-icons/io5'; // Install react-icons if not available
import { SearchIcon } from '@chakra-ui/icons';
import { searchTutors } from '../../service/ApiTutorBiography';

const SearchTutor = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    // Glassmorphism Styles
    const bgColor = useColorModeValue('whiteAlpha.800', 'whiteAlpha.100');
    const borderColor = useColorModeValue('purple.200', 'purple.500');

    const handleSearch = async () => {
        if (!searchQuery) return;

        setLoading(true);
        try {
            const data = await searchTutors(searchQuery);
            setResults(data.data || []);
        } catch (error) {
            console.error("AI Search Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="container.md" py={10}>
            <VStack spacing={8} align="stretch">
                {/* Header Section */}
                <VStack spacing={2} textAlign="center">
                    <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                        AI-POWERED MATCHING
                    </Badge>
                    <Heading
                        bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
                        bgClip="text"
                        fontSize="4xl"
                        fontWeight="extrabold"
                    >
                        Find Your Perfect Tutor
                    </Heading>
                    <Text color="gray.500" fontSize="lg">
                        Describe your needs in plain English (e.g., "Need a calm math teacher for a shy 8th grader")
                    </Text>
                </VStack>

                {/* AI Input Area */}
                <Box
                    p={6}
                    bg={bgColor}
                    backdropFilter="blur(10px)"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                    position="relative"
                    _before={{
                        content: '""',
                        position: 'absolute',
                        top: "-2px", left: "-2px", right: "-2px", bottom: "-2px",
                        background: "linear-gradient(45deg, #4299E1, #9F7AEA, #ED64A6)",
                        borderRadius: "24px",
                        zIndex: -1,
                        opacity: 0.3
                    }}
                >
                    <VStack spacing={4}>
                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <Icon as={IoSparkles} color="purple.400" />
                            </InputLeftElement>
                            <Input
                                placeholder="How can I help your child today?"
                                variant="filled"
                                bg={useColorModeValue('gray.50', 'gray.800')}
                                border="none"
                                _focus={{ border: '1px solid', borderColor: 'purple.400' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>

                        <Button
                            w="full"
                            size="lg"
                            leftIcon={<SearchIcon />}
                            bgGradient="linear(to-r, blue.400, purple.500)"
                            color="white"
                            _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)", transform: "translateY(-2px)" }}
                            _active={{ transform: "translateY(0)" }}
                            onClick={handleSearch}
                            isLoading={loading}
                            loadingText="Consulting AI..."
                        >
                            Search with AI
                        </Button>
                    </VStack>
                </Box>

                {/* Results Preview (Optional) */}
                {loading ? (
                    <Stack spacing={4}>
                        <Skeleton h="80px" borderRadius="xl" />
                        <Skeleton h="80px" borderRadius="xl" />
                    </Stack>
                ) : (
                    <VStack spacing={4}>
                        {/* Inside your results.map section */}
                        {results.map((tutor) => (
                            <Box
                                key={tutor.id}
                                w="full"
                                p={5}
                                borderRadius="2xl"
                                borderWidth="1px"
                                bg="white"
                                shadow="sm"
                                _hover={{ shadow: 'lg', borderColor: 'purple.400', transform: 'translateY(-2px)' }}
                                transition="all 0.3s"
                            >
                                <HStack justifyContent="space-between">
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="bold" fontSize="xl">
                                            {tutor.firstName} {tutor.lastName}
                                        </Text>
                                        <Text fontSize="md" color="gray.600">{tutor.headline}</Text>
                                        <HStack spacing={2} mt={2}>
                                            {tutor.subjectList?.slice(0, 3).map(sub => (
                                                <Badge key={sub} variant="subtle" colorScheme="blue">{sub}</Badge>
                                            ))}
                                        </HStack>
                                    </VStack>

                                    {/* AI Match Badge */}
                                    <VStack align="end">
                                        <Badge
                                            fontSize="sm"
                                            colorScheme={tutor.matchScore > 80 ? "green" : "orange"}
                                            variant="solid"
                                            borderRadius="lg"
                                            px={3}
                                        >
                                            {tutor.matchScore}% AI Match
                                        </Badge>
                                        <Text fontWeight="bold" color="purple.600">₹{tutor.fees?.monthly}/mo</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        ))}

                    </VStack>
                )}
            </VStack>
        </Container>
    );
};

export default SearchTutor;
