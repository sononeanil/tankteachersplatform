import { Box, Flex, Text } from "@chakra-ui/react";

const VennView = ({ data }: { data: any }) => {
    console.log("VennView Data Received:", data); // Check your browser console!

    if (!data || !data.uniqueA) {
        return <Text>Data is missing internal properties!</Text>;
    }

    return (
        <Flex position="relative" height="400px" width="100%" justify="center" align="center" mt={10}>
            {/* Circle A */}
            <Box
                position="absolute" left="15%" w="300px" h="300px"
                borderRadius="full" bg="rgba(66, 153, 225, 0.4)" border="2px solid #3182ce"
                p={10} textAlign="left"
            >
                <Text fontWeight="bold" mb={2} textAlign="center">{data.conceptA}</Text>
                {data.uniqueA.map((p: string, i: number) => <Text fontSize="xs" key={i}>• {p}</Text>)}
            </Box>

            {/* Circle B */}
            <Box
                position="absolute" right="15%" w="300px" h="300px"
                borderRadius="full" bg="rgba(72, 187, 120, 0.4)" border="2px solid #38a169"
                p={10} textAlign="right"
            >
                <Text fontWeight="bold" mb={2} textAlign="center">{data.conceptB}</Text>
                {data.uniqueB.map((p: string, i: number) => <Text fontSize="xs" key={i}>• {p}</Text>)}
            </Box>

            {/* Intersection (Center) */}
            <Box
                zIndex={2} position="absolute" w="150px" textAlign="center"
            >
                <Text fontWeight="bold" fontSize="sm">Both</Text>
                {data.common.map((p: string, i: number) => (
                    <Text fontSize="xs" fontWeight="medium" key={i}>{p}</Text>
                ))}
            </Box>
        </Flex>
    );
};

export default VennView;