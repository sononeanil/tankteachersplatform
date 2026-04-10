import { Box, Button, Container, Flex, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { getChapterList } from "../../service/ApiNotes";

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

    return (
        <Box
            bg="blue.100"
            borderRadius="2xl"
            boxShadow="0 15px 40px rgba(0,0,0,0.12)"
            p={{ base: 4, md: 6 }}
        >
            <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
                Let us know your preferences
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


        </Box>
    );
};
export default Filter