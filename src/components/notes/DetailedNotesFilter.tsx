import React from 'react';
import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    HStack,
    Text,
    Badge,
    Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const DetailedNotesFilter = () => {
    const navigate = useNavigate();

    const standards = ["VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const boards = ["CBSE", "ICSE"];
    const subjects = ["Science", "English"];

    const handleNavigation = (std: string, board: string, subject: string) => {
        const stdNum = std === "VI" ? "6" : std;
        const url = `/notesBatchDetails?standard=${stdNum}&board=${board}&subject=${subject}`;
        navigate(url);
    };

    return (
        <Box
            mt={10}
            w="100%"           // Spans across full width of parent
            p={6}
            bg="white"
            shadow="2xl"
            borderRadius="2xl"
            position="relative" // Required for the absolute positioning of the Badge
            border="1px solid"
            borderColor="blue.50"
        >
            {/* Top Section with Title and Badge */}
            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="xl" fontWeight="extrabold" color="blue.800" letterSpacing="tight">
                    Select Your Curriculum
                </Text>
                <Badge
                    colorScheme="purple"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    boxShadow="0 4px 10px rgba(128, 90, 213, 0.3)"
                >
                    Detailed Notes
                </Badge>
            </Flex>

            {/* Horizontal Scroll Menu */}
            <HStack
                spacing={4}
                overflowX="auto"
                pb={2}
                px={1}
                sx={{
                    '&::-webkit-scrollbar': { display: 'none' },
                    'scrollbar-width': 'none',
                }}
            >
                {standards.map((std) => (
                    <Menu key={std} isLazy>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            colorScheme="blue"
                            variant="outline"
                            minW="130px"
                            h="50px"
                            borderRadius="xl"
                            fontSize="md"
                            _hover={{ bg: "blue.50", borderColor: "blue.300" }}
                            _active={{ bg: "blue.100" }}
                        >
                            Class {std}
                        </MenuButton>

                        <MenuList borderRadius="xl" shadow="xl" p={2} border="1px solid" borderColor="gray.100">
                            {boards.map((board) => (
                                <Box key={`${std}-${board}`}>
                                    <Text
                                        px={3}
                                        py={2}
                                        fontSize="10px"
                                        fontWeight="bold"
                                        color="gray.400"
                                        textTransform="uppercase"
                                    >
                                        {board} Board
                                    </Text>
                                    {subjects.map((sub) => (
                                        <MenuItem
                                            key={`${std}-${board}-${sub}`}
                                            onClick={() => handleNavigation(std, board, sub)}
                                            borderRadius="md"
                                            _hover={{ bg: "blue.500", color: "white" }}
                                            py={2}
                                            fontWeight="semibold"
                                        >
                                            {sub}
                                        </MenuItem>
                                    ))}
                                    <MenuDivider />
                                </Box>
                            ))}
                        </MenuList>
                    </Menu>
                ))}
            </HStack>
        </Box>
    );
};

export default DetailedNotesFilter;
