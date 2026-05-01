import { Box, Button, Flex, Text, Badge, Icon, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Optional: If you have @chakra-ui/icons installed
import { StarIcon, InfoIcon } from "@chakra-ui/icons";

const Filter = () => {
    const filters = [
        "VIII", "IX", "X", "XI", "XII",
        "Tutor", "Parent", "Course Publisher", "Engineering Graduate"
    ];

    const classFilters = ["VIII", "IX", "X", "XI", "XII"];
    const boardFilters = ["cbse", "icsc"];
    const subjectFilters = ["English", "Science"];

    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const isClassSelected = selectedFilter && classFilters.includes(selectedFilter);
    const isBoardSelected = !!selectedBoard;
    const navigate = useNavigate();

    const tutorOptions = ["Create Bio", "Update your Profile"];
    const parentOptions = ["Search for Tutors for your child", "Update your Profile"];
    const isTutorSelected = selectedFilter === "Tutor";
    const isParentSelected = selectedFilter === "Parent";

    return (
        <Box
            bgGradient="linear(to-br, blue.300, blue.700)"
            borderRadius="3xl"
            boxShadow="0 20px 50px rgba(0,0,0,0.1)"
            p={{ base: 5, md: 8 }}
            border="1px solid"
            borderColor="whiteAlpha.600"
            position="relative"
            overflow="hidden"
            mt={10}
        >
            {/* 🏷️ Feature Badges */}
            <HStack mb={6} spacing={3} wrap="wrap">
                <Badge
                    px={3} py={1}
                    borderRadius="full"
                    bg="purple.500"
                    color="white"
                    fontSize="xs"
                    boxShadow="0 4px 12px rgba(128, 90, 213, 0.4)"
                    display="flex"
                    alignItems="center"
                >
                    <Icon as={StarIcon} mr={1} boxSize={2} /> Beginner Friendly Notes
                </Badge>
                <Badge
                    px={3} py={1}
                    borderRadius="full"
                    bg="teal.600"
                    color="white"
                    fontSize="xs"
                    boxShadow="0 4px 12px rgba(7, 23, 191, 0.4)"
                    display="flex"
                    alignItems="center"
                >
                    <Icon as={InfoIcon} mr={1} boxSize={2} /> Interactive Mind Maps
                </Badge>
            </HStack>

            <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                color="white"
                mb={6}
                lineHeight="tall"
            >
                Click on the filters to explore resources tailored for you! 🚀
            </Text>

            {/* 🔹 Main Filters */}
            <Flex w="full" gap={3} wrap="wrap" mb={6}>
                {filters.map((item) => (
                    <Button
                        key={item}
                        onClick={() => {
                            setSelectedFilter(item);
                            setSelectedBoard(null);
                            setSelectedSubject(null);
                        }}
                        bg={selectedFilter === item ? "blue.600" : "white"}
                        color={selectedFilter === item ? "white" : "blue.600"}
                        borderRadius="xl"
                        px={6}
                        height="45px"
                        fontSize="sm"
                        fontWeight="bold"
                        boxShadow={selectedFilter === item ? "0 8px 20px rgba(43, 108, 176, 0.3)" : "sm"}
                        _hover={{
                            bg: selectedFilter === item ? "blue.700" : "blue.50",
                            transform: "translateY(-2px)",
                            boxShadow: "lg"
                        }}
                        transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
                    >
                        {item}
                    </Button>
                ))}
            </Flex>

            {/* 🔸 Board Filter - Styled as a sub-card */}
            {isClassSelected && (
                <Box bg="whiteAlpha.500" p={4} borderRadius="2xl" mb={4} border="1px dashed" borderColor="blue.300">
                    <Text fontSize="xs" fontWeight="black" color="blue.400" mb={3} textTransform="uppercase" letterSpacing="widest">
                        Step 2: Choose Board
                    </Text>
                    <Flex w="full" gap={3} wrap="wrap">
                        {boardFilters.map((item) => (
                            <Button
                                key={item}
                                onClick={() => {
                                    setSelectedBoard(item);
                                    setSelectedSubject(null);
                                }}
                                colorScheme="blue"
                                variant={selectedBoard === item ? "solid" : "outline"}
                                borderRadius="full"
                                textTransform="uppercase"
                                px={8}
                                fontSize="xs"
                            >
                                {item}
                            </Button>
                        ))}
                    </Flex>
                </Box>
            )}

            {/* 🔹 Subject Filter */}
            {isClassSelected && isBoardSelected && (
                <Box bg="blue.600" p={4} borderRadius="2xl" boxShadow="inner">
                    <Text fontSize="xs" fontWeight="bold" color="blue.100" mb={3} textTransform="uppercase">
                        Final Step: Select Subject
                    </Text>
                    <Flex w="full" gap={3} wrap="wrap">
                        {subjectFilters.map((item) => (
                            <Button
                                key={item}
                                onClick={() => {
                                    setSelectedSubject(item);
                                    const finalKey = `${selectedBoard}/Class${selectedFilter}/${item}`;
                                    navigate(`/filterDetails/${encodeURIComponent(finalKey)}`);
                                }}
                                bg="white"
                                color="blue.700"
                                borderRadius="lg"
                                px={10}
                                _hover={{ bg: "blue.50", transform: "scale(1.05)" }}
                            >
                                {item}
                            </Button>
                        ))}
                    </Flex>
                </Box>
            )}

            {/* Tutor/Parent Options - Enhanced Visibility */}
            {(isTutorSelected || isParentSelected) && (
                <Flex
                    w="full" gap={3} wrap="wrap" mt={4} p={4}
                    bg="white" borderRadius="2xl" border="2px solid" borderColor="blue.200"
                >
                    {(isTutorSelected ? tutorOptions : parentOptions).map((item) => (
                        <Button
                            key={item}
                            onClick={() => {
                                navigate(isTutorSelected ? `/tutor/createBio` : `/parent/searchTutor`);
                            }}
                            colorScheme="blue"
                            variant="ghost"
                            leftIcon={<span>✨</span>}
                            _hover={{ bg: "blue.50" }}
                        >
                            {item}
                        </Button>
                    ))}
                </Flex>
            )}
        </Box>
    );
};

export default Filter;
