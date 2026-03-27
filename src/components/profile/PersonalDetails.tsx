import { Badge, Box, Card, CardBody, CardHeader, Divider, GridItem, Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import { FaUserCircle } from "react-icons/fa";
import { Text } from "@chakra-ui/react";
import { getUserFromToken } from "../../service/ApiClient";

const PersonalDetails = () => {

    const decodedUser = getUserFromToken();
    const email = decodedUser?.sub;
    const role = decodedUser?.roles?.[0];
    return (
        <>

            <Card mb={10} maxW="xl" mx="auto" boxShadow="xl" borderRadius="lg" p={6} bg="gray.50">
                <CardBody>
                    <Stack spacing={4}>
                        <Box textAlign="center">
                            <FaUserCircle size="60px" color="#2B6CB0" />
                            <Heading size="md" mt={2}>
                                {/* {firstName} {lastName} */}
                            </Heading>
                            <Badge colorScheme="blue" mt={1}>
                                {email}
                            </Badge>
                        </Box>

                        <Divider />

                        <SimpleGrid columns={2} spacing={4}>
                            <Text><strong>First Name:</strong> </Text>
                            <Text><strong>Last Name:</strong> </Text>
                            <Text><strong>User Login Id:</strong> {email}</Text>
                            <Text><strong>User Number:</strong> 123456</Text>
                            <Text ><strong>Email:</strong> {email}</Text>
                            <Text ><strong>Address:</strong> SP Lane, Mulshi</Text>
                            <Text><strong>City:</strong> </Text>
                            <Text><strong>Country:</strong> </Text>
                        </SimpleGrid>
                    </Stack>
                </CardBody>
            </Card>
        </>

    )
}

export default PersonalDetails;