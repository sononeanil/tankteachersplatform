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
    HStack
} from "@chakra-ui/react";
import { FaCheckCircle, FaLightbulb, FaExchangeAlt, FaBookmark } from "react-icons/fa";

interface NoteItem {
    note: string;
    explanation: string;
    examKeywords?: string[];
    marksBoosterTip?: string;
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
            <Text textAlign="center" py={12} color="gray.400" fontWeight="medium">
                No interactive revision assets compiled for this module yet.
            </Text>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap={6}>
            {notes.map((item, index) => {
                const isRead = !!readCards[index];

                // 🎯 SMART PARSER: Isolate any embedded text analogies out of explanations dynamically
                const parts = item.explanation.split(/Analogy:/i);
                const coreExplanation = parts[0].trim();
                const analogyText = parts[1] ? parts[1].trim() : null;

                return (
                    <Box
                        key={index}
                        bg="white"
                        p={{ base: 5, md: 6 }}
                        borderRadius="2xl"
                        position="relative"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={isRead ? "green.200" : "gray.100"}
                        boxShadow={
                            isRead
                                ? "0 4px 20px -2px rgba(72, 187, 120, 0.08)"
                                : "0 12px 30px -10px rgba(0, 0, 0, 0.04), 0 4px 10px -5px rgba(0, 0, 0, 0.02)"
                        }
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                        _hover={{
                            transform: "translateY(-4px)",
                            boxShadow: isRead
                                ? "0 10px 25px -2px rgba(72, 187, 120, 0.15)"
                                : "0 20px 35px -10px rgba(0, 0, 0, 0.09)"
                        }}
                    >
                        {/* Status Decorative Highlight Bar */}
                        <Box
                            position="absolute" top={0} left={0} right={0} h="4px"
                            bg={isRead ? "green.400" : "blue.400"}
                            transition="background-color 0.2s"
                        />

                        <Box>
                            {/* Card Header Profile */}
                            <Flex justify="space-between" align="start" mb={4}>
                                <HStack spacing={2} align="start">
                                    <Icon as={FaBookmark} mt={1} color={isRead ? "green.400" : "blue.300"} w={4} h={4} />
                                    <Heading size="sm" fontSize="md" color="gray.800" letterSpacing="tight" lineHeight="short">
                                        {item.note}
                                    </Heading>
                                </HStack>

                                {isRead && (
                                    <Badge colorScheme="green" variant="solid" borderRadius="full" px={2} py={0.5} display="flex" alignItems="center" gap={1}>
                                        <Icon as={FaCheckCircle} /> Completed
                                    </Badge>
                                )}
                            </Flex>

                            {/* Core Technical Concept Explanation Block */}
                            <Text color="gray.600" fontSize="14px" lineHeight="relaxed" mb={4}>
                                {coreExplanation}
                            </Text>

                            {/* Analogy Bridge Block */}
                            {analogyText && (
                                <Box
                                    bg="blue.50" p={3.5} borderRadius="xl" mb={4}
                                    border="1px solid" borderColor="blue.100"
                                    position="relative"
                                >
                                    <Flex align="center" mb={1.5}>
                                        <Icon as={FaExchangeAlt} color="blue.500" w={3.5} h={3.5} mr={1.5} />
                                        <Text fontSize="11px" fontWeight="extrabold" color="blue.700" letterSpacing="wider" uppercase>
                                            Conceptual Bridge (Analogy)
                                        </Text>
                                    </Flex>
                                    <Text fontSize="xs" color="gray.600" fontStyle="italic" lineHeight="md">
                                        "{analogyText}"
                                    </Text>
                                </Box>
                            )}

                            {/* Syllabus Keywords Badges Deck */}
                            {item.examKeywords && item.examKeywords.length > 0 && (
                                <Wrap spacing={1.5} mb={4}>
                                    {item.examKeywords.map((kw) => (
                                        <WrapItem key={kw}>
                                            <Badge
                                                bg="gray.50" color="gray.500" border="1px solid" borderColor="gray.200"
                                                px={2.5} py={0.5} borderRadius="full" fontSize="10px" fontWeight="bold"
                                                _hover={{ bg: "blue.50", color: "blue.600", borderColor: "blue.200" }}
                                                transition="all 0.15s" cursor="default"
                                            >
                                                #{kw}
                                            </Badge>
                                        </WrapItem>
                                    ))}
                                </Wrap>
                            )}

                            {/* Interactive Marks Booster Block */}
                            {item.marksBoosterTip && (
                                <Box
                                    bg="amber.50" backgroundColor="#FFFDF5" p={3.5} borderRadius="xl"
                                    borderLeft="4px solid" borderColor="yellow.400" mb={4}
                                    boxShadow="xs"
                                >
                                    <Flex align="center" mb={1}>
                                        <Icon as={FaLightbulb} color="yellow.500" w={3.5} h={3.5} mr={1.5} />
                                        <Text fontSize="11px" fontWeight="extrabold" color="amber.800" uppercase letterSpacing="wide">
                                            Exam Score Booster
                                        </Text>
                                    </Flex>
                                    <Text fontSize="xs" color="gray.600" fontWeight="medium" lineHeight="short">
                                        {item.marksBoosterTip}
                                    </Text>
                                </Box>
                            )}
                        </Box>

                        {/* Card Interactive Footer Control Station */}
                        <Flex justify="flex-end" mt={3} borderTop="1px solid" borderColor="gray.50" pt={3}>
                            <Tooltip
                                label={isRead ? "You have unlocked this card's XP reward!" : "Add +10 XP to your account balance"}
                                placement="top" hasArrow borderRadius="md" fontSize="xs"
                            >
                                <Button
                                    size="sm"
                                    colorScheme={isRead ? "green" : "blue"}
                                    variant={isRead ? "subtle" : "solid"}
                                    onClick={() => onExplore(index)}
                                    isDisabled={isRead}
                                    borderRadius="xl"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    px={4}
                                    boxShadow={isRead ? "none" : "sm"}
                                    leftIcon={isRead ? <Icon as={FaCheckCircle} /> : undefined}
                                    _hover={isRead ? {} : { transform: "translateY(-1px)", boxShadow: "md" }}
                                    _active={isRead ? {} : { transform: "translateY(0)" }}
                                    transition="all 0.15s"
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