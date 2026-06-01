import { Badge, HStack, Icon, Menu, MenuButton, MenuList, MenuItem, Button, Link, VStack } from "@chakra-ui/react";
import { StarIcon, InfoIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
    MSB11thClassMenuSubjects,
    MSB12thClassMenuSubjects,
} from "../../types/MenuData";

const MsbFilter = () => {
    return (
        <VStack
            mb={5}
            mt={5}
            spacing={4}
            align="stretch"
            shadow={"inner"}
            p={5}
            borderRadius="3xl"
            bg="blue.500"
            // border="2px solid" // Slightly thickened the component boundary frame
            // borderColor="purple.500"
            width="100%"
        >
            {/* ROW 1: Badges sit securely at the top with highly legible contrast values */}
            <HStack wrap="wrap" spacing={3}>
                <Badge
                    px={3.5}
                    py={2}
                    borderRadius="full"
                    // FIXED: Replaced semi-transparent white with a strong, deep royal purple backdrop
                    bg="purple.800"
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    border="1px solid"
                    borderColor="purple.400"
                    textTransform="none"
                    letterSpacing="wide"
                    boxShadow="0 2px 10px rgba(128, 90, 213, 0.2)"
                >
                    <Icon as={StarIcon} mr={2} boxSize={3.5} color="yellow.300" fill="currentColor" />
                    Maharashtra State Board Commerce
                </Badge>

                <Badge
                    px={3.5}
                    py={2}
                    borderRadius="full"
                    // FIXED: Boosted color depth slightly to maintain a high glow output contrast
                    bg="cyan.600"
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    textTransform="none"
                    letterSpacing="wide"
                    boxShadow="0 0 15px rgba(0, 163, 196, 0.4)"
                >
                    <Icon as={InfoIcon} mr={2} boxSize={3.5} color="white" />
                    Interactive Mind Maps
                </Badge>
            </HStack>

            {/* ROW 2: Class standards cleanly underneath */}
            <HStack wrap="wrap" spacing={3}>
                {/* --- 11th Standard Subject Menu --- */}
                <Menu isLazy>
                    <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        bg="purple.600"
                        color="white"
                        _hover={{ bg: "purple.500", transform: "translateY(-1px)" }}
                        _active={{ bg: "purple.700" }}
                        size="sm"
                        borderRadius="xl"
                        px={5}
                        py={4}
                        fontWeight="bold"
                        transition="all 0.2s"
                        border="1px solid"
                        borderColor="purple.400"
                    >
                        11th Standard
                    </MenuButton>
                    <MenuList
                        minWidth="220px"
                        p={1.5}
                        borderRadius="xl"
                        boxShadow="2xl"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        {MSB11thClassMenuSubjects.map((subjectItem) => (
                            <MenuItem
                                key={subjectItem.value}
                                as={Link}
                                href={`/notes/onehourBeforeexam/maharashtra-state-board/msb11${subjectItem.value.toLowerCase()}`}
                                fontWeight="semibold"
                                color="gray.700"
                                borderRadius="lg"
                                py={2}
                                px={3}
                                _hover={{
                                    textDecoration: 'none',
                                    bg: 'purple.50',
                                    color: 'purple.700'
                                }}
                            >
                                {subjectItem.label}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                {/* --- 12th Standard Subject Menu --- */}
                <Menu isLazy>
                    <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        bg="pink.600"
                        color="white"
                        _hover={{ bg: "pink.500", transform: "translateY(-1px)" }}
                        _active={{ bg: "pink.700" }}
                        size="sm"
                        borderRadius="xl"
                        px={5}
                        py={4}
                        fontWeight="bold"
                        transition="all 0.2s"
                        border="1px solid"
                        borderColor="pink.400"
                    >
                        12th Standard
                    </MenuButton>
                    <MenuList
                        minWidth="220px"
                        p={1.5}
                        borderRadius="xl"
                        boxShadow="2xl"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        {MSB12thClassMenuSubjects.map((subjectItem) => (
                            <MenuItem
                                key={subjectItem.value}
                                as={Link}
                                href={`/notes/onehourBeforeexam/maharashtra-state-board/msb12${subjectItem.value.toLowerCase()}`}
                                fontWeight="semibold"
                                color="gray.700"
                                borderRadius="lg"
                                py={2}
                                px={3}
                                _hover={{
                                    textDecoration: 'none',
                                    bg: 'pink.50',
                                    color: 'pink.600'
                                }}
                            >
                                {subjectItem.label}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </HStack>
        </VStack>
    );
};

export default MsbFilter;