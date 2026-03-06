import { Avatar, Badge, Box, Card, CardBody, CardHeader, Divider, GridItem, Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import { FaUserCircle } from "react-icons/fa";
import { Text } from "@chakra-ui/react";

const PersonalDetails = () => {
    const userInfoString = localStorage.getItem("loggedInUser");
    const { firstName, lastName, email, city, country, role } = userInfoString ? JSON.parse(userInfoString) : null;

    return (
        <>

            <GridItem colSpan={1}>
                <Box>
                    <Text fontSize="lg" color="teal.600">First Name:</Text>
                    <Text>{firstName}</Text>
                </Box>
            </GridItem>


            <Card mb={10} maxW="xl" mx="auto" boxShadow="xl" borderRadius="lg" p={6} bg="gray.50">
                <CardBody>
                    <Stack spacing={4}>
                        <Box textAlign="center">
                            <FaUserCircle size="60px" color="#2B6CB0" />
                            <Heading size="md" mt={2}>
                                {firstName} {lastName}
                            </Heading>
                            <Badge colorScheme="blue" mt={1}>
                                {email}
                            </Badge>
                        </Box>

                        <Divider />

                        <SimpleGrid columns={2} spacing={4}>
                            <Text><strong>First Name:</strong> {firstName}</Text>
                            <Text><strong>Last Name:</strong> {lastName}</Text>
                            <Text><strong>User Login Id:</strong> {email}</Text>
                            <Text><strong>User Number:</strong> 123456</Text>
                            <Text ><strong>Email:</strong> {email}</Text>
                            <Text ><strong>Address:</strong> SP Lane, Mulshi</Text>
                            <Text><strong>City:</strong> {"city"}</Text>
                            <Text><strong>Country:</strong> {"country"}</Text>
                        </SimpleGrid>
                    </Stack>
                </CardBody>
            </Card>

            <Card mb={10} maxW="lg" mx="auto" boxShadow="xl" borderRadius="lg" bg="white">
                <CardHeader textAlign="center">
                    <Heading size="md" color="teal.600">
                        User Profile
                    </Heading>
                </CardHeader>

                <Divider />

                <CardBody>
                    <SimpleGrid columns={2} spacing={6}>
                        <Box>
                            <Text fontWeight="bold" color="gray.600">First Name:</Text>
                            <Text>{firstName}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">Last Name:</Text>
                            <Text>{lastName}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">User Number:</Text>
                            <Text>123456</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">User Login Id:</Text>
                            <Text>{email}</Text>
                        </Box>

                        <Box >
                            <Text fontWeight="bold" color="gray.600">Email:</Text>
                            <Text>{email}</Text>
                        </Box>

                        <Box >
                            <Text fontWeight="bold" color="gray.600">Address:</Text>
                            <Text>SP Lane, Mulshi</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">City:</Text>
                            <Text>{city}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">Country:</Text>
                            <Text>{country}</Text>
                        </Box>
                    </SimpleGrid>
                </CardBody>
            </Card>

            <Card mb={10} maxW="lg" mx="auto" boxShadow="xl" borderRadius="lg" bg="white">
                <CardHeader textAlign="center">
                    <Stack spacing={2} align="center">
                        {/* Avatar */}
                        <Avatar size="xl" name={`${firstName} ${lastName}`} bg="teal.500" />

                        {/* Name */}
                        <Heading size="md" color="teal.600">
                            {firstName} {lastName}
                        </Heading>

                        {/* Role Badge */}
                        <Badge colorScheme="purple" variant="solid">
                            {role || "Role Not Available"}
                        </Badge>

                        {/* Email */}
                        <Text fontSize="sm" color="gray.500">
                            {email}
                        </Text>
                    </Stack>
                </CardHeader>

                <Divider />

                <CardBody>
                    <SimpleGrid columns={2} spacing={6}>
                        <Box>
                            <Text fontWeight="bold" color="gray.600">First Name:</Text>
                            <Text>{firstName}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">Last Name:</Text>
                            <Text>{lastName}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">User Login Id:</Text>
                            <Text>{email}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">User Number:</Text>
                            <Text>123456</Text>
                        </Box>

                        <Box >
                            <Text fontWeight="bold" color="gray.600">Address:</Text>
                            <Text>SP Lane, Mulshi</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">City:</Text>
                            <Text>{city}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" color="gray.600">Country:</Text>
                            <Text>{country}</Text>
                        </Box>
                    </SimpleGrid>
                </CardBody>
            </Card>


        </>

    )
}

export default PersonalDetails;