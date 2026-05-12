import { InfoIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, VStack, Heading, UnorderedList, ListItem, Tooltip, Icon } from "@chakra-ui/react";

const VennView = ({ data }) => {
    return (
        <Flex
            position="relative"
            justify="center"
            align="center"
            h="500px"
            w="100%"
            overflow="hidden"
            bg="gray.50"
            borderRadius="2xl"
        >
            {/* Concept A: Exothermic */}
            <Box
                w="350px"
                h="350px"
                borderRadius="full"
                bgGradient="radial(orange.400, red.500)"
                opacity="0.7"
                position="absolute"
                left="15%"
                display="flex"
                flexDirection="column"
                p={8}
                color="white"
                boxShadow="0 0 40px rgba(255, 69, 0, 0.4)"
                transition="all 0.3s"
                _hover={{ opacity: 0.8, transform: "scale(1.02)" }}
            >
                <Heading size="md" mb={4} textAlign="left">{data.conceptA}</Heading>
                <VStack align="start" spacing={2}>
                    {data.uniqueA.map((item, i) => (
                        <Tooltip key={i} label={item} fontSize="md" placement="top" hasArrow>
                            <Flex align="center" cursor="pointer" _hover={{ color: "orange.200" }}>
                                <Icon as={InfoIcon} mr={2} />
                                <Text fontSize="sm" noOfLines={1}>{item.split(':')[0]}</Text>
                            </Flex>
                        </Tooltip>
                    ))}
                </VStack>
            </Box>

            {/* Concept B: Endothermic */}
            <Box
                w="350px"
                h="350px"
                borderRadius="full"
                bgGradient="radial(cyan.400, blue.600)"
                opacity="0.7"
                position="absolute"
                right="15%"
                display="flex"
                flexDirection="column"
                p={8}
                color="white"
                boxShadow="0 0 40px rgba(0, 191, 255, 0.4)"
                transition="all 0.3s"
                _hover={{ opacity: 0.8, transform: "scale(1.02)" }}
            >
                <Heading size="md" mb={4} textAlign="right">{data.conceptB}</Heading>
                <VStack align="end" spacing={2} textAlign="right">
                    {data.uniqueB.map((item, i) => (
                        <Text key={i} fontSize="xs" fontWeight="bold">• {item}</Text>
                    ))}
                </VStack>
            </Box>

            {/* Intersection: Common Ground */}
            <Box
                zIndex={2}
                w="180px"
                textAlign="center"
                p={4}
                bg="rgba(255, 255, 255, 0.2)"
                backdropFilter="blur(10px)"
                borderRadius="xl"
                border="1px solid rgba(255,255,255,0.3)"
            >
                <Text fontWeight="black" fontSize="sm" color="gray.800" mb={2}>SHARED</Text>
                <VStack spacing={1}>
                    {data.common.map((item, i) => (
                        <Text key={i} fontSize="10px" color="gray.700" lineHeight="tight">{item}</Text>
                    ))}
                </VStack>
            </Box>
        </Flex>
    );
};

export default VennView;