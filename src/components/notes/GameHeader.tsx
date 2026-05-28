import React from "react";
import { Box, Flex, Text, Heading, Progress, Badge, Icon } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

interface GameHeaderProps {
    decodedType: string | null;
    xp: number;
    currentLevel: number;
    xpTowardsNextLevel: number;
    overallProgress: number;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(({
    decodedType,
    xp,
    currentLevel,
    xpTowardsNextLevel,
    overallProgress,
}) => {
    return (
        <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" mb={6} border="1px solid" borderColor="gray.100">
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                {/* Module Title */}
                <Box>
                    <Badge colorScheme="purple" mb={1} borderRadius="md" px={2}>
                        Study Track
                    </Badge>
                    <Heading size="lg" color="gray.800" textTransform="capitalize">
                        {decodedType || "General Workspace"}
                    </Heading>
                </Box>

                {/* Level & XP Counter */}
                <Flex align="center" gap={4}>
                    <Flex align="center" bg="amber.50" p={2} borderRadius="xl" border="1px solid" borderColor="amber.200">
                        <Icon as={StarIcon} color="amber.400" w={5} h={5} mr={2} />
                        <Text fontWeight="bold" color="slate.700">
                            Level {currentLevel}
                        </Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Total XP: <Text as="span" fontWeight="bold" color="blue.600">{xp}</Text>
                    </Text>
                </Flex>
            </Flex>

            {/* Progress Bars Section */}
            <Box mt={6}>
                <Flex justify="space-between" fontSize="xs" color="gray.600" mb={1} fontWeight="semibold">
                    <Text>Level Progress ({xpTowardsNextLevel} / 200 XP)</Text>
                    <Text>Chapter Completion: {overallProgress}%</Text>
                </Flex>

                <Flex gap={4} align="center" direction={{ base: "column", md: "row" }}>
                    {/* XP Progress */}
                    <Progress
                        value={(xpTowardsNextLevel / 200) * 100}
                        size="sm"
                        colorScheme="blue"
                        borderRadius="full"
                        flex={1}
                        w="100%"
                    />
                    {/* Overall Material Mastery */}
                    <Progress
                        value={overallProgress}
                        size="sm"
                        colorScheme="green"
                        borderRadius="full"
                        flex={1}
                        w="100%"
                    />
                </Flex>
            </Box>
        </Box>
    );
});

GameHeader.displayName = "GameHeader";