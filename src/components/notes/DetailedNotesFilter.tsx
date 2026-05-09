import React, { useRef } from 'react';
import {
    Box, Button, Menu, MenuButton, MenuList, MenuItem,
    MenuDivider, HStack, Text, Badge, Flex, Portal, useDisclosure
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
    const navigate = useNavigate();
    const standards = ["VI", "VII", "VIII", "IX", "X", "XI", "XII"];

    const getStdNum = (std: string) => {
        const mapping: Record<string, string> = { "VI": "6", "VII": "7", "VIII": "8", "IX": "9", "X": "10" };
        return mapping[std] || std;
    };

    return (
        <Box mt={10} w="100%" p={6} bg="white" shadow="2xl" borderRadius="2xl" border="1px solid" borderColor="blue.50">
            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="xl" fontWeight="extrabold" color="blue.800">Select Your Curriculum</Text>
                <Badge colorScheme="purple" variant="solid" px={3} py={1} borderRadius="full">Detailed Notes</Badge>
            </Flex>

            <HStack spacing={4} overflowX="auto" pb={2} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                {standards.map((std) => (
                    <Menu key={std} isLazy closeOnSelect={false}>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue" variant="outline" minW="140px">
                            Class {std}
                        </MenuButton>

                        <MenuList borderRadius="xl" shadow="xl" p={2}>
                            <Text px={3} py={1} fontSize="10px" fontWeight="bold" color="gray.400" letterSpacing="widest">
                                CBSE BOARD
                            </Text>
                            <SubMenu label="Science" std={getStdNum(std)} board="CBSE" />
                            <MenuDivider />
                        </MenuList>
                    </Menu>
                ))}
            </HStack>
        </Box>
    );
};

const SubMenu = ({ label, std, board }: { label: string, std: string, board: string }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const timeoutRef = useRef<number>();

    const chapters = CHAPTER_DATA[`${std}_${label}`] || [];

    const handleMouseEnter = () => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        onOpen();
    };

    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(onClose, 200); // 200ms delay to prevent accidental closing
    };

    return (
        <Menu isOpen={isOpen} placement="right-start" offset={[0, 10]} isLazy>
            <MenuButton
                as={MenuItem}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={onOpen}
                borderRadius="md"
                _hover={{ bg: "blue.500", color: "white" }}
            >
                <Flex justify="space-between" align="center" w="100%">
                    <Text fontWeight="semibold">{label}</Text>
                    <ChevronRightIcon />
                </Flex>
            </MenuButton>

            <Portal>
                <MenuList
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    shadow="2xl"
                    borderRadius="xl"
                    p={1}
                    zIndex={9999}
                >
                    {chapters.map((chap) => (
                        <MenuItem
                            key={chap}
                            onClick={() => {
                                onClose();
                                navigate(`/getDetailedNotes?standard=${std}&board=${board}&subject=${label}&chapter=${chap.replace(/\D/g, "")}`);
                            }}
                            _hover={{ bg: "blue.50", color: "blue.600" }}
                        >
                            {chap}
                        </MenuItem>
                    ))}
                </MenuList>
            </Portal>
        </Menu>
    );
};

export default DetailedNotesFilter;
