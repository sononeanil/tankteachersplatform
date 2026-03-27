import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,

    Divider,

    Heading,
    Input,

    SimpleGrid,
    Stack,
    Text,

} from "@chakra-ui/react";
import { useState } from "react";
import { getUserFromToken } from "../service/ApiClient";



const PersonalDetails = () => {
    const decodedUser = getUserFromToken();

    const [user, setUser] = useState({
        email: decodedUser?.sub || "",
        role: decodedUser?.roles?.[0] || ""
    });

    const [isEditing, setIsEditing] = useState(false);

    // Handle input changes
    const handleChange = (field: string, value: string) => {
        setUser({ ...user, [field]: value });
    };

    // Save changes to localStorage (and backend if needed)
    const handleSave = () => {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        // TODO: call backend API here with updated user info
        setIsEditing(false);
    };


    return (
        <>
            <Card mb={10} maxW="lg" mx="auto" boxShadow="xl" borderRadius="lg" bg="white">
                <CardHeader textAlign="center">
                    <Stack spacing={2} align="center">
                        {/* <Avatar size="xl" name={`${user.firstName} ${user.lastName}`} bg="teal.500" /> */}
                        <Heading size="md" color="teal.600">
                            {/* {user.firstName} {user.lastName} */}
                        </Heading>
                        <Badge colorScheme="purple" variant="solid">
                            {user.role || "Student"}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                            {user.email}
                        </Text>
                    </Stack>
                </CardHeader>

                <Divider />

                <CardBody>
                    <SimpleGrid columns={2} spacing={6}>




                        <Box>
                            <Text fontWeight="bold" color="gray.600">User Login Id:</Text>
                            {isEditing ? (
                                <Input value={user.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
                            ) : (
                                <Text>{user.email}</Text>
                            )}
                        </Box>




                    </SimpleGrid>

                    <Stack direction="row" spacing={4} mt={6} justify="center">
                        {isEditing ? (
                            <>
                                <Button colorScheme="teal" onClick={handleSave}>Save</Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </>
                        ) : (
                            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>Edit</Button>
                        )}
                    </Stack>
                </CardBody>
            </Card>




        </>
    );
};

export default PersonalDetails;