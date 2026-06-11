import React, { useState } from "react";
import {
    Box,
    Flex,
    Text,
    Badge,
    Icon,
    HStack,
    VStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useColorModeValue
} from "@chakra-ui/react";
import { StarIcon, InfoIcon, ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiActivity, FiGlobe, FiLayers } from "react-icons/fi";

// Explicit imports from your data file (Updated to include Classes 9 through 12)
import {
    Class6Boards,
    CBSEClass6,
    ICSEClass6,
    Class7Boards,
    CBSEClass7,
    Class8Boards,
    CBSEClass8,
    Class9Boards,
    CBSEClass9,
    Class10Boards,
    CBSEClass10,
    Class11Boards,
    CBSEClass11,
    Class12Boards,
    CBSEClass12
} from "../../types/MenuData";

const getSubjectIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes("sci") || lower.includes("phys") || lower.includes("chem")) return FiActivity;
    if (lower.includes("math") || lower.includes("calc")) return FiLayers;
    if (lower.includes("hist") || lower.includes("geo") || lower.includes("social")) return FiGlobe;
    return FiBookOpen;
};

// Clean structural lookup map (Updated registry mapping to register all standard objects)
const fixedMenuMap: Record<string, {
    boards: { label: string; value: string }[];
    subjects: Record<string, { label: string; value: string; url: string }[]>
}> = {
    "6": {
        boards: Class6Boards,
        subjects: {
            "CBSE": CBSEClass6,
            "ICSE": ICSEClass6
        }
    },
    "7": {
        boards: Class7Boards,
        subjects: {
            "CBSE": CBSEClass7
        }
    },
    "8": {
        boards: Class8Boards,
        subjects: {
            "CBSE": CBSEClass8
        }
    },
    "9": {
        boards: Class9Boards,
        subjects: {
            "CBSE": CBSEClass9
        }
    },
    "10": {
        boards: Class10Boards,
        subjects: {
            "CBSE": CBSEClass10
        }
    },
    "11": {
        boards: Class11Boards,
        subjects: {
            "CBSE": CBSEClass11
        }
    },
    "12": {
        boards: Class12Boards,
        subjects: {
            "CBSE": CBSEClass12
        }
    }
};

const Filter = () => {
    const navigate = useNavigate();

    // Track the currently active class and selected board state
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

    const textColor = useColorModeValue("gray.800", "white");
    const subTextColor = useColorModeValue("gray.500", "gray.400");
    const menuListBg = useColorModeValue("white", "gray.800");
    const menuItemColor = useColorModeValue("gray.700", "gray.200");
    const menuBorderColor = useColorModeValue("gray.200", "gray.700");

    const classButtonColors = [
        { bg: "purple.600", hover: "purple.500", active: "purple.700", outline: "purple.400" },
        { bg: "pink.600", hover: "pink.500", active: "pink.700", outline: "pink.400" },
        { bg: "blue.600", hover: "blue.500", active: "blue.700", outline: "blue.400" },
    ];

    // Updated Array to display classes 6 through 12 in UI loop sequentially
    const activeClasses = ["6", "7", "8", "9", "10", "11", "12"];

    return (
        <Box
            bg="transparent"
            p={{ base: 4, md: 6 }}
            maxWidth="1100px"
            mx="auto"
            mt={4}
            color={textColor}
        >
            {/* --- TOP BADGES --- */}
            <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={3}>
                <HStack spacing={2} wrap="wrap">
                    <Badge px={3} py={1} borderRadius="lg" bg="purple.500" color="white" fontSize="xs" fontWeight="bold">
                        <Icon as={StarIcon} mr={1} boxSize={2.5} /> Quick Summaries
                    </Badge>
                    <Badge px={3} py={1} borderRadius="lg" bg="teal.500" color="white" fontSize="xs" fontWeight="bold">
                        <Icon as={InfoIcon} mr={1} boxSize={2.5} /> Premium MCQs
                    </Badge>
                </HStack>
                <Text fontSize="xs" fontWeight="bold" color="blue.500" textTransform="uppercase" letterSpacing="wider">
                    Targeted Exam Prep 🎯
                </Text>
            </Flex>

            {/* --- INTERACTIVE MENU WRAPPER --- */}
            <VStack align="start" spacing={4} width="full">
                <Text fontSize="xs" fontWeight="black" color={subTextColor} textTransform="uppercase" letterSpacing="widest">
                    Select Your Standard, Board & Subject
                </Text>

                <HStack wrap="wrap" spacing={{ base: 2, md: 3 }} width="full">
                    {activeClasses.map((cls, index) => {
                        const colorConfig = classButtonColors[index % classButtonColors.length];
                        const classData = fixedMenuMap[cls];

                        if (!classData) return null;

                        return (
                            <Menu
                                key={cls}
                                isLazy
                                placement="bottom-start"
                                onClose={() => {
                                    setSelectedClass(null);
                                    setSelectedBoard(null);
                                }}
                            >
                                <MenuButton
                                    as={Button}
                                    rightIcon={<ChevronDownIcon />}
                                    bg={colorConfig.bg}
                                    color="white"
                                    _hover={{ bg: colorConfig.hover, transform: "translateY(-2px)", boxShadow: "md" }}
                                    _active={{ bg: colorConfig.active, transform: "translateY(0)" }}
                                    size="sm"
                                    borderRadius="xl"
                                    px={5}
                                    py={4}
                                    fontWeight="bold"
                                    transition="all 0.2s"
                                    border="1px solid"
                                    borderColor={colorConfig.outline}
                                    onClick={() => {
                                        setSelectedClass(cls);
                                        setSelectedBoard(null);
                                    }}
                                >
                                    Class {cls}
                                </MenuButton>

                                <MenuList
                                    p={0}
                                    borderRadius="xl"
                                    boxShadow="2xl"
                                    bg={menuListBg}
                                    border="1px solid"
                                    borderColor={menuBorderColor}
                                    zIndex={10}
                                    overflow="hidden"
                                >
                                    <Flex direction="row" minH="150px">

                                        {/* COLUMN 1: BOARDS DISPLAY LIST */}
                                        <Box p={2} minW="140px">
                                            <Text fontSize="10px" fontWeight="bold" color={subTextColor} px={3} py={1} mb={1} textTransform="uppercase">
                                                Board
                                            </Text>
                                            {classData.boards.map((board) => {
                                                const isBoardActive = selectedBoard === board.value && selectedClass === cls;
                                                return (
                                                    <Box
                                                        key={board.value}
                                                        role="menuitem"
                                                        tabIndex={0}
                                                        cursor="pointer"
                                                        fontWeight="bold"
                                                        borderRadius="lg"
                                                        py={2.5}
                                                        px={3}
                                                        my={0.5}
                                                        bg={isBoardActive ? `${colorConfig.bg.split('.')[0]}.50` : "transparent"}
                                                        color={isBoardActive ? colorConfig.bg : menuItemColor}
                                                        _hover={{
                                                            bg: `${colorConfig.bg.split('.')[0]}.50`,
                                                            color: colorConfig.bg
                                                        }}
                                                        _dark={{
                                                            _hover: { bg: "gray.700", color: "white" },
                                                            bg: isBoardActive ? "gray.700" : "transparent",
                                                            color: isBoardActive ? "white" : menuItemColor
                                                        }}
                                                        onClick={() => {
                                                            setSelectedClass(cls);
                                                            setSelectedBoard(board.value);
                                                        }}
                                                        onMouseEnter={() => {
                                                            setSelectedClass(cls);
                                                            setSelectedBoard(board.value);
                                                        }}
                                                    >
                                                        <Flex justify="space-between" align="center" width="100%">
                                                            <Text>{board.label}</Text>
                                                            <Icon as={ChevronRightIcon} boxSize={4} opacity={isBoardActive ? 1 : 0.4} />
                                                        </Flex>
                                                    </Box>
                                                );
                                            })}
                                        </Box>

                                        {/* COLUMN 2: SUBJECTS LIST */}
                                        {selectedClass === cls && selectedBoard && classData.subjects[selectedBoard] && (
                                            <Box
                                                p={2}
                                                minW="180px"
                                                bg={useColorModeValue("gray.50", "gray.750")}
                                                borderLeft="1px solid"
                                                borderColor={menuBorderColor}
                                            >
                                                <Text fontSize="10px" fontWeight="bold" color={subTextColor} px={3} py={1} mb={1} textTransform="uppercase">
                                                    Subject
                                                </Text>
                                                {classData.subjects[selectedBoard].map((subject) => (
                                                    <MenuItem
                                                        key={subject.value}
                                                        icon={<Icon as={getSubjectIcon(subject.label)} boxSize={4} />}
                                                        onClick={() => {
                                                            // Ensures the base URL starts with a single forward slash if missing
                                                            const baseUrl = subject.url.startsWith('/') ? subject.url : `/${subject.url}`;

                                                            // Dynamically appends exactly: /Class_X_Subject
                                                            const processedUrl = `${baseUrl}/Class_${cls}_${subject.label}`;

                                                            navigate(processedUrl);
                                                        }}
                                                        fontWeight="semibold"
                                                        color={menuItemColor}
                                                        borderRadius="lg"
                                                        py={2}
                                                        px={3}
                                                        my={0.5}
                                                        _hover={{
                                                            bg: `${colorConfig.bg.split('.')[0]}.50`,
                                                            color: colorConfig.bg
                                                        }}
                                                        _dark={{ _hover: { bg: "gray.700", color: "white" } }}
                                                    >
                                                        {subject.label}
                                                    </MenuItem>
                                                ))}
                                            </Box>
                                        )}

                                    </Flex>
                                </MenuList>
                            </Menu>
                        );
                    })}
                </HStack>
            </VStack>
        </Box>
    );
};

export default Filter;