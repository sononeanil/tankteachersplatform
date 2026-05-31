import { Badge, HStack, Icon, Menu, MenuButton, MenuList, MenuItem, Button, Link } from "@chakra-ui/react";
import { StarIcon, InfoIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
    MSB11thClassMenuSubjects,
    MSB12thClassMenuSubjects,
} from "../../types/MenuData";

const MsbFilter = () => {
    return (
        <HStack
            mb={6}
            spacing={3}
            wrap="wrap"
            shadow="dark-lg"
            p={4}
            borderRadius="2xl"
            bgGradient="linear(to-br, purple.50, white, pink.50)"
            border="1px solid"
            borderColor="purple.100"
        >
            {/* Context Badges */}
            <Badge px={3} py={1} borderRadius="full" bg="purple.500" color="white" fontSize="xs" display="flex" alignItems="center">
                <Icon as={StarIcon} mr={1} boxSize={2} /> Maharashtra State Board Commerce Notes
            </Badge>
            <Badge px={3} py={1} borderRadius="full" bg="teal.600" color="white" fontSize="xs" display="flex" alignItems="center">
                <Icon as={InfoIcon} mr={1} boxSize={2} /> Interactive Mind Maps
            </Badge>

            {/* --- 11th Standard Subject Menu (1-Level) --- */}
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="purple" variant="outline" size="sm" borderRadius="lg">
                    11th Standard
                </MenuButton>
                <MenuList minWidth="200px" p={1}>
                    {MSB11thClassMenuSubjects.map((subjectItem) => (
                        <MenuItem
                            key={subjectItem.value}
                            as={Link}
                            href={`/notes/onehourBeforeexam/maharashtra-state-board/msb11${subjectItem.value.toLowerCase()}`}
                            fontWeight="medium"
                            color="purple.700"
                            _hover={{ textDecoration: 'none', bg: 'purple.50' }}
                        >
                            {subjectItem.label}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            {/* --- 12th Standard Subject Menu (1-Level) --- */}
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="pink" variant="outline" size="sm" borderRadius="lg">
                    12th Standard
                </MenuButton>
                <MenuList minWidth="200px" p={1}>
                    {MSB12thClassMenuSubjects.map((subjectItem) => (
                        <MenuItem
                            key={subjectItem.value}
                            as={Link}
                            href={`/notes/onehourBeforeexam/maharashtra-state-board/msb12${subjectItem.value.toLowerCase()}`}
                            fontWeight="medium"
                            color="pink.700"
                            _hover={{ textDecoration: 'none', bg: 'pink.50' }}
                        >
                            {subjectItem.label}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </HStack>
    );
};

export default MsbFilter;