import { useQuery } from "@tanstack/react-query";
import { getAllStudentForParent } from "../../Api";
import { useEffect } from "react";
import { Avatar, Badge, Box, Card, CardBody, Divider, Heading, List, ListItem, SimpleGrid, Stack, Text, useToast } from "@chakra-ui/react";

const ViewStudents = () => {
    const toast = useToast();
    const userInfoString = localStorage.getItem("loggedInUser");
    const { id } = userInfoString ? JSON.parse(userInfoString) : {};

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getAllStudentForParent", id],   // unique cache key
        queryFn: () => getAllStudentForParent(id),   // function to call

    });

    useEffect(() => {
        if (isError) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast({
                title: "Failed to load students",
                description: message,
                status: "error",
                duration: null,
                isClosable: true,
                position: "top",
            });
        }
    }, [isError, error, toast]);


    if (isLoading) {
        return <div>Loading.....</div>
    }

    return (
        <div>


            <Box p={6}>
                <Heading size="md" mb={4} textAlign="center" color="teal.600">
                    Students List
                </Heading>

                <List spacing={4}>
                    {data?.map((student, index) => (
                        <ListItem key={index}>
                            <Card variant="outline" borderColor="teal.200" _hover={{ shadow: "md" }}>
                                <CardBody>
                                    <Stack direction="row" spacing={6} align="flex-start">
                                        {/* Avatar */}
                                        <Avatar
                                            name={`${student.firstName} ${student.lastName}`}
                                            bg="teal.400"
                                            color="white"
                                            size="lg"
                                        />

                                        {/* Student Info */}
                                        <Box flex="1">
                                            <SimpleGrid columns={3} spacing={2}>
                                                <Heading size="sm" color="teal.700">
                                                    {student.firstName} {student.middleName} {student.lastName}
                                                </Heading>
                                                <Text fontSize="sm" color="gray.600">
                                                    Nickname: {student.nickName || "N/A"}
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    Email: {student.email}
                                                </Text>

                                                <Text fontSize="sm" color="gray.600">
                                                    Phone: ""
                                                </Text>
                                                <Text fontSize="md" fontWeight="bold" color="tomato">
                                                    User Id: {student.firstName.toLowerCase() + student.parentId + "@sp.com"}
                                                </Text>

                                            </SimpleGrid>
                                            <Divider my={2} borderColor="red.400" borderWidth="1px" />

                                            {/* Grid for details */}
                                            <SimpleGrid columns={2} spacing={2}>
                                                <Text><b>Age:</b> {student.age}</Text>
                                                <Text><b>Gender:</b> {student.gender}</Text>
                                                <Text><b>Class:</b> {student.classEntrolled}</Text>
                                                <Text><b>Subjects:</b> {student.subjectEnrolled}</Text>
                                                <Text><b>Attendance:</b> {student.attendancePercentage}%</Text>
                                                <Text><b>DOB:</b> {student.dateOfBirth}</Text>
                                                <Text><b>Admission:</b> {student.dateOfAdmission}</Text>
                                                <Text><b>Parent ID:</b> {student.parentId}</Text>
                                            </SimpleGrid>

                                            {/* Badge for quick highlight */}
                                            <Stack direction="row" mt={3}>
                                                <Badge colorScheme="blue">Class {student.classEntrolled}</Badge>
                                                <Badge colorScheme="green">{student.gender}</Badge>
                                                <Badge colorScheme="purple">{student.subjectEnrolled}</Badge>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardBody>
                            </Card>
                        </ListItem>
                    ))}
                </List>
            </Box>




        </div>
    )
};

export default ViewStudents