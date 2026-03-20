import { Badge, Box, Divider, Heading, List, ListIcon, ListItem, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { classroomDescriptions, classroomTypeList } from "../../types/ClassroomTypes";
import { CheckCircleIcon } from "@chakra-ui/icons";

const ClassRoomDetails = () => {
    const { id } = useParams();

    // Find classroom by id
    const classroom = classroomTypeList.find(c => c.id === Number(id));


    if (!classroom) {
        return <div>Class Room is not available</div>
    }

    return (
        <>
            <Box maxW="900px" mx="auto" mt={10} p={8} bg="white" shadow="xl" borderRadius="lg">
                {/* Header */}
                <Heading size="lg" mb={2} color="teal.600">
                    {classroom.name}
                </Heading>
                <Badge colorScheme="purple" mb={4}>
                    Access Level: {classroom.accessLevel}
                </Badge>

                <Divider mb={6} />

                {/* Section 1: Overview */}
                <VStack align="start" spacing={4} mb={8}>
                    <Heading size="md" color="gray.700">Overview</Heading>
                    <Box p={4} bg="teal.50" borderLeft="4px solid teal" borderRadius="md">
                        <Text fontSize="md" color="gray.800" lineHeight="tall">
                            {classroomDescriptions[classroom.id] || ""}
                        </Text>
                    </Box>
                </VStack>

                {/* Section 2: Key Features */}
                <VStack align="start" spacing={4} mb={8}>
                    <Heading size="md" color="gray.700">Key Features</Heading>
                    <List spacing={3}>
                        <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Interactive learning environment
                        </ListItem>
                        <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Modern tools and resources
                        </ListItem>
                        <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Role‑based access for students and teachers
                        </ListItem>
                    </List>
                </VStack>

                {/* Section 3: Benefits */}
                <VStack align="start" spacing={4} mb={8}>
                    <Heading size="md" color="gray.700">Benefits</Heading>
                    <Text fontSize="md" color="gray.800">
                        Students gain hands‑on experience, while teachers can manage content easily.
                        The classroom fosters collaboration, creativity, and deeper understanding.
                    </Text>
                </VStack>

                {/* Section 4: Resources */}
                <VStack align="start" spacing={4}>
                    <Heading size="md" color="gray.700">Resources</Heading>
                    <Text fontSize="md" color="gray.800">
                        Access to digital libraries, recorded sessions, and interactive quizzes.
                    </Text>
                </VStack>
                <Box mt={8} p={6} bgGradient="linear(to-r, teal.100, blue.100)" borderRadius="md">
                    <Text fontSize="md" fontStyle="italic" color="gray.600">
                        "Learning is not confined to four walls — this classroom opens doors to new possibilities."
                    </Text>
                </Box>
            </Box>



        </>
    );


}

export default ClassRoomDetails