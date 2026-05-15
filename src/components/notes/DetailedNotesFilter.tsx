import React from 'react';
import {
    Box, Button, Menu, MenuButton, MenuList, MenuItem,
    MenuDivider, HStack, Text, Badge, Flex, Collapse, useDisclosure, Icon
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const CHAPTER_DATA: Record<string, string[]> = {
    "6_Science": ["Chapter 1", "Chapter 2"],
    "7_Science": ["Chapter 1", "Chapter 2", "Chapter 3"],
    "8_Science": ["Chapter 1", "Chapter 2"],
    "9_Science": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
    "10_Science": ["Chapter 1", "Chapter 2", "Chapter 3"],
};

const DetailedNotesFilter = () => {
    const standards = ["VI", "VII", "VIII", "IX", "X", "XI", "XII"];

    const getStdNum = (std: string) => {
        const mapping: Record<string, string> = { "VI": "6", "VII": "7", "VIII": "8", "IX": "9", "X": "10" };
        return mapping[std] || std;
    };

    return (
        <Box
            mt={10}
            w="100%"
            p={{ base: 4, md: 6 }}
            // Soft gradient background
            bgGradient="linear(to-br, blue.50, white, purple.50)"
            shadow="2xl"
            borderRadius="2xl"
            border="1px solid"
            borderColor="blue.100"
            borderTop="4px solid" // Adds a nice "accent" bar at the top
            borderTopColor="blue.500"
        >

            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="extrabold" color="blue.800">Select Your Curriculum</Text>
                <Badge colorScheme="purple" variant="solid" px={3} py={1} borderRadius="full">Detailed Notes</Badge>
            </Flex>

            <HStack
                spacing={4}
                overflowX="auto"
                pb={4}
                px={1}
                sx={{
                    /* For Chrome, Safari and Opera */
                    '&::-webkit-scrollbar': {
                        height: '8px' // Slightly thicker for easier visibility
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'blue.50', // Light blue background track
                        borderRadius: '10px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'blue.600', // Strong blue color
                        borderRadius: '10px',
                        border: '2px solid', // Creates a "padding" effect around the thumb
                        borderColor: 'blue.50',
                    },
                    '&::-webkit-scrollbar-thumb:active': {
                        background: 'blue.800', // Darker blue when touched
                    },
                    /* For Firefox */
                    scrollbarWidth: 'auto', // Standard thickness
                    scrollbarColor: '#2B6CB0 #EBF8FF', // Blue.600 and Blue.50
                }}
            >
                {standards.map((std) => (
                    <Menu key={std} isLazy closeOnSelect={false}>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            colorScheme="blue"
                            variant="outline"
                            flexShrink={0}
                            minW="130px"
                        >
                            Class {std}
                        </MenuButton>

                        <MenuList borderRadius="xl" shadow="xl" p={2} minW="200px">
                            <Text px={3} py={1} fontSize="10px" fontWeight="bold" color="gray.400" letterSpacing="widest">
                                CBSE BOARD
                            </Text>
                            {/* Pass parent menu close logic if needed, but closeOnSelect={false} handles it */}
                            <MobileFriendlySubMenu label="Science" std={getStdNum(std)} board="CBSE" />
                            <MenuDivider />
                        </MenuList>
                    </Menu>
                ))}
            </HStack>
        </Box>
    );
};

const MobileFriendlySubMenu = ({ label, std, board }: { label: string, std: string, board: string }) => {
    const { isOpen, onToggle } = useDisclosure();
    const navigate = useNavigate();
    const chapters = CHAPTER_DATA[`${std}_${label}`] || [];

    return (
        <Box>
            <MenuItem
                onClick={onToggle}
                _hover={{ bg: "blue.500", color: "white" }}
                _active={{ bg: "blue.600", color: "white" }}
                display="flex"
                justifyContent="space-between"
                fontWeight="semibold"
                borderRadius="md"
            >
                {label}
                <Icon
                    as={ChevronRightIcon}
                    transform={isOpen ? "rotate(90deg)" : ""}
                    transition="transform 0.2s"
                />
            </MenuItem>

            <Collapse in={isOpen} animateOpacity>
                <Box pl={4} mt={1} borderLeft="2px solid" borderColor="blue.100" mb={2}>
                    {chapters.length > 0 ? (
                        chapters.map((chap) => (
                            <MenuItem
                                key={chap}
                                fontSize="sm"
                                py={2}
                                borderRadius="md"
                                onClick={() => {
                                    navigate(`/getDetailedNotes?standard=${std}&board=${board}&subject=${label}&chapter=${chap.replace(/\D/g, "")}`);
                                }}
                                _hover={{ bg: "blue.50", color: "blue.600" }}
                            >
                                {chap}
                            </MenuItem>
                        ))
                    ) : (
                        <Text fontSize="xs" color="gray.500" pl={3} py={2}>No Chapters Found</Text>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

export default DetailedNotesFilter;