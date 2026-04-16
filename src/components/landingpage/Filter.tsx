import { Box, Button, Flex, Text } from "@chakra-ui/react"

import { useState } from "react";
import { useNavigate } from "react-router-dom"


const Filter = () => {
    const filters = [
        "VIII", "IX", "X", "XI", "XII",
        "Tutor", "Course Publisher", "Engineering Graduate"
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
    // 🔥 Build final key
    const tutorOptions = ["Create Bio", "Update your Profile"];
    const isTutorSelected = selectedFilter === "Tutor";
    return (
        <Box
            bg="blue.100"
            borderRadius="2xl"
            boxShadow="0 15px 40px rgba(0,0,0,0.12)"
            p={{ base: 4, md: 6 }}
        >
            <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
                Click on the filters to explore notes, Mind Maps, Practice Test and resources tailored for you!
            </Text>

            {/* 🔹 Main Filters */}
            <Flex w="full" gap={3} wrap="wrap" mb={4}>
                {filters.map((item) => (
                    <Button
                        key={item}
                        onClick={() => {
                            setSelectedFilter(item);
                            setSelectedBoard(null);
                            setSelectedSubject(null);
                        }}
                        bg={selectedFilter === item ? "blue.400" : "white"}
                        color={selectedFilter === item ? "white" : "blue.600"}
                        borderRadius="full"
                        px={6}

                        boxShadow={selectedFilter === item ? "md" : "sm"}  // 👈 default shadow

                        _hover={{
                            bg: selectedFilter === item ? "blue.500" : "blue.100",
                            color: selectedFilter === item ? "white" : "blue.700",
                            boxShadow: "lg",                // 👈 stronger on hover
                            transform: "translateY(-2px)"   // 👈 lift effect
                        }}

                        _active={{
                            boxShadow: "sm",
                            transform: "scale(0.97)"        // 👈 press effect
                        }}

                        transition="all 0.2s ease"
                    >
                        {item}
                    </Button>
                ))}
            </Flex>

            {/* 🔸 Board Filter */}
            {isClassSelected && (
                <Flex w="full" gap={3} wrap="wrap" mb={4}>
                    {boardFilters.map((item) => (
                        <Button
                            key={item}
                            onClick={() => {
                                setSelectedBoard(item);
                                setSelectedSubject(null);
                            }}
                            bg={selectedBoard === item ? "blue.400" : "white"}
                            color={selectedBoard === item ? "white" : "blue.600"}
                            borderRadius="full"
                            px={6}
                        >
                            {item}
                        </Button>
                    ))}
                </Flex>
            )}

            {/* 🔹 Subject Filter */}
            {isClassSelected && isBoardSelected && (
                <Flex w="full" gap={3} wrap="wrap">
                    {subjectFilters.map((item) => (
                        <Button
                            key={item}
                            onClick={() => {
                                setSelectedSubject(item);

                                const finalKey = `${selectedBoard}/Class${selectedFilter}/${item}`;
                                navigate(`/filterDetails/${encodeURIComponent(finalKey)}`);

                            }}
                            bg={selectedSubject === item ? "blue.400" : "white"}
                            color={selectedSubject === item ? "white" : "blue.600"}
                            borderRadius="full"
                            px={6}
                        >
                            {item}
                        </Button>
                    ))}
                </Flex>
            )}

            {isTutorSelected && (
                <Flex w="full" gap={3} wrap="wrap" mt={4}>
                    {tutorOptions.map((item) => (
                        <Button
                            key={item}
                            onClick={() => {
                                navigate(`/tutor/createBio`);

                            }}
                            bg="white"
                            color="blue.600"
                            borderRadius="full"
                            px={6}
                            boxShadow="sm"

                            _hover={{
                                bg: "blue.100",
                                color: "blue.700",
                                boxShadow: "lg",
                                transform: "translateY(-2px)"
                            }}

                            _active={{
                                boxShadow: "sm",
                                transform: "scale(0.97)"
                            }}

                            transition="all 0.2s ease"
                        >
                            {item}
                        </Button>
                    ))}
                </Flex>
            )}


        </Box>
    );
};
export default Filter