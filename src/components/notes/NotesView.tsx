import React from "react";
import {
    Box,
    SimpleGrid,
    Text,
    Heading,
    Button,
    Flex,
    Badge,
    Wrap,
    WrapItem,
    Icon,
    Tooltip,
    HStack,
    VStack
} from "@chakra-ui/react";
import {
    FaCheckCircle,
    FaLightbulb,
    FaExchangeAlt,
    FaBookmark,
    FaExclamationTriangle,
    FaSchool
} from "react-icons/fa";

interface NoteItem {
    note: string;
    explanation?: string; // 💡 Changed to optional to fix the type mismatch
    examKeywords?: string[];
    marksBoosterTip?: string;
    commonMisconception?: string;
    classroomConnection?: string;
}

interface NotesViewProps {
    notes?: NoteItem[];
    readCards: Record<number, boolean>;
    onExplore: (index: number) => void;
}

export const NotesView: React.FC<NotesViewProps> = React.memo(({
    notes = [],
    readCards,
    onExplore
}) => {
    if (notes.length === 0) {
        return (
            <Text textAlign="center" py={16} color="gray.400" fontSize="lg" fontWeight="semibold">
                No interactive revision assets compiled for this module yet.
            </Text>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap={8}>
            {notes.map((item, index) => {
                const isRead = !!readCards[index];

                // 💡 Added safe fallback string in case explanation is undefined
                const parts = (item.explanation || "").split(/Analogy:/i);
                const coreExplanation = parts[0].trim();
                const analogyText = parts[1] ? parts[1].trim() : null;

                return (
                    <Box
                        key={index}
                        bg="white"
                        p={{ base: 6, md: 8 }}
                        borderRadius="2xl"
                        position="relative"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={isRead ? "green.300" : "blue.100"}
                        boxShadow={
                            isRead
                                ? "0 10px 30px -5px rgba(72, 187, 120, 0.1)"
                                : "0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.01)"
                        }
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        transition="all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                        _hover={{
                            transform: "translateY(-6px)",
                            boxShadow: isRead
                                ? "0 20px 40px -5px rgba(72, 187, 120, 0.18)"
                                : "0 30px 50px -10px rgba(0, 0, 0, 0.12)"
                        }}
                    >
                        {/* Decorative Top Accent Bar */}
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            h="5px"
                            bg={isRead ? "green.400" : "blue.500"}
                            transition="background-color 0.2s"
                        />

                        <Box>
                            {/* Card Header */}
                            <Flex justify="space-between" align="start" mb={5}>
                                <HStack spacing={3} align="start" maxW={isRead ? "75%" : "100%"}>
                                    <Icon
                                        as={FaBookmark}
                                        mt={1}
                                        color={isRead ? "green.500" : "blue.500"}
                                        w={5}
                                        h={5}
                                        flexShrink={0}
                                    />
                                    <Heading
                                        size="sm"
                                        fontSize="lg"
                                        color="gray.800"
                                        fontWeight="extrabold"
                                        letterSpacing="tight"
                                        lineHeight="short"
                                    >
                                        {item.note}
                                    </Heading>
                                </HStack>

                                {isRead && (
                                    <Badge
                                        colorScheme="green"
                                        variant="subtle"
                                        bg="green.50"
                                        color="green.600"
                                        border="1px solid"
                                        borderColor="green.200"
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="bold"
                                        display="flex"
                                        alignItems="center"
                                        gap={1.5}
                                    >
                                        <Icon as={FaCheckCircle} w={3.5} h={3.5} /> Mastered
                                    </Badge>
                                )}
                            </Flex>

                            {/* Core Explanation Block */}
                            {coreExplanation && (
                                <Text
                                    color="gray.700"
                                    fontSize="15px"
                                    fontWeight="medium"
                                    lineHeight="relaxed"
                                    mb={5}
                                // Adjusted margin conditionally if no analogy is next
                                >
                                    {coreExplanation}
                                </Text>
                            )}

                            {/* Analogy Bridge Block */}
                            {analogyText && (
                                <Box
                                    bg="blue.50"
                                    p={4}
                                    borderRadius="xl"
                                    mb={5}
                                    border="1px solid"
                                    borderColor="blue.100"
                                    borderLeft="4px solid"
                                    borderLeftColor="blue.400"
                                >
                                    <Flex align="center" mb={2}>
                                        <Icon as={FaExchangeAlt} color="blue.600" w={4} h={4} mr={2} />
                                        <Text fontSize="11px" fontWeight="black" color="blue.700" letterSpacing="wider" textTransform="uppercase">
                                            Conceptual Bridge (Analogy)
                                        </Text>
                                    </Flex>
                                    <Text fontSize="13px" color="gray.700" fontStyle="italic" fontWeight="medium" lineHeight="base">
                                        "{analogyText}"
                                    </Text>
                                </Box>
                            )}

                            {/* Keywords Badges Deck */}
                            {item.examKeywords && item.examKeywords.length > 0 && (
                                <Wrap spacing={2} mb={6}>
                                    {item.examKeywords.map((kw) => (
                                        <WrapItem key={kw}>
                                            <Badge
                                                color="gray.600"
                                                border="1px solid"
                                                px={3}
                                                py={1}
                                                borderRadius="md"
                                                fontSize="11px"
                                                fontWeight="bold"
                                                _hover={{ bg: "blue.50", color: "blue.600", borderColor: "blue.300" }}
                                                transition="all 0.2s"
                                                cursor="default"
                                            >
                                                #{kw}
                                            </Badge>
                                        </WrapItem>
                                    ))}
                                </Wrap>
                            )}

                            {/* Supplemental Revision Cards Container */}
                            <VStack align="stretch" spacing={4} mb={5}>
                                {/* Exam Score Booster */}
                                {item.marksBoosterTip && (
                                    <Box
                                        bg="yellow.50" // 💡 Fixed contrast issues (swapped away from hardcoded purple #de9ade)
                                        p={4}
                                        borderRadius="xl"
                                        border="1px solid"
                                        borderColor="yellow.200"
                                        borderLeft="4px solid"
                                        borderLeftColor="yellow.400"
                                        boxShadow="sm"
                                    >
                                        <Flex align="center" mb={1.5}>
                                            <Icon as={FaLightbulb} color="yellow.600" w={4} h={4} mr={2} />
                                            <Text fontSize="11px" fontWeight="black" color="yellow.800" textTransform="uppercase" letterSpacing="wider">
                                                Exam Score Booster
                                            </Text>
                                        </Flex>
                                        <Text fontSize="13px" color="gray.700" fontWeight="semibold" lineHeight="normal">
                                            {item.marksBoosterTip}
                                        </Text>
                                    </Box>
                                )}

                                {/* Common Misconceptions */}
                                {item.commonMisconception && (
                                    <Box
                                        bg="red.50"
                                        p={4}
                                        borderRadius="xl"
                                        border="1px solid"
                                        borderColor="red.100"
                                        borderLeft="4px solid"
                                        borderLeftColor="red.400"
                                        boxShadow="sm"
                                    >
                                        <Flex align="center" mb={1.5}>
                                            <Icon as={FaExclamationTriangle} color="red.500" w={4} h={4} mr={2} />
                                            <Text fontSize="11px" fontWeight="black" color="red.800" textTransform="uppercase" letterSpacing="wider">
                                                Common Misconception
                                            </Text>
                                        </Flex>
                                        <Text fontSize="13px" color="gray.700" fontWeight="semibold" lineHeight="normal">
                                            {item.commonMisconception}
                                        </Text>
                                    </Box>
                                )}

                                {/* Classroom Connections */}
                                {item.classroomConnection && (
                                    <Box
                                        bg="purple.50"
                                        p={4}
                                        borderRadius="xl"
                                        border="1px solid"
                                        borderColor="purple.100"
                                        borderLeft="4px solid"
                                        borderLeftColor="purple.400"
                                        boxShadow="sm"
                                    >
                                        <Flex align="center" mb={1.5}>
                                            <Icon as={FaSchool} color="purple.500" w={4} h={4} mr={2} />
                                            <Text fontSize="11px" fontWeight="black" color="purple.800" textTransform="uppercase" letterSpacing="wider">
                                                Classroom Connection
                                            </Text>
                                        </Flex>
                                        <Text fontSize="13px" color="gray.700" fontWeight="semibold" lineHeight="normal">
                                            {item.classroomConnection}
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        </Box>

                        {/* Card Footer Control Station */}
                        <Flex justify="flex-end" mt={4} borderTop="1px solid" borderColor="gray.100" pt={4}>
                            <Tooltip
                                label={isRead ? "You have unlocked this card's XP reward!" : "Add +10 XP to your balance"}
                                placement="top"
                                hasArrow
                                borderRadius="lg"
                                fontSize="xs"
                                px={3}
                                py={1.5}
                            >
                                <Button
                                    size="md"
                                    colorScheme={isRead ? "green" : "blue"}
                                    variant={isRead ? "outline" : "solid"}
                                    bg={isRead ? "green.50" : "blue.500"}
                                    color={isRead ? "green.600" : "white"}
                                    borderColor={isRead ? "green.200" : "transparent"}
                                    onClick={() => onExplore(index)}
                                    isDisabled={isRead}
                                    borderRadius="xl"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    px={6}
                                    boxShadow={isRead ? "none" : "0 4px 14px rgba(66, 153, 225, 0.4)"}
                                    leftIcon={isRead ? <Icon as={FaCheckCircle} w={4} h={4} /> : undefined}
                                    _hover={isRead ? {} : { transform: "translateY(-2px)", bg: "blue.600", boxShadow: "0 6px 20px rgba(66, 153, 225, 0.6)" }}
                                    _active={isRead ? {} : { transform: "translateY(0)" }}
                                    transition="all 0.2s"
                                >
                                    {isRead ? "Mastered (+10 XP)" : "Mark as Studied"}
                                </Button>
                            </Tooltip>
                        </Flex>
                    </Box>
                );
            })}
        </SimpleGrid>
    );
});

NotesView.displayName = "NotesView";
export default NotesView;