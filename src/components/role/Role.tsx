
import { Box, Button, Checkbox, CheckboxGroup, FormControl, FormLabel, GridItem, HStack, Input, SimpleGrid, Stack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

import { getUserRole, updateUserRoles } from "../../Api";
import { useMutation } from "@tanstack/react-query";
import type { UpdateUserRoleType } from "../../types/userType";

const Role = () => {

    const [email, setEmail] = useState<string>("");
    const [userId, setUserId] = useState<number>(-1);

    const { mutateAsync, data } = useMutation({
        mutationFn: getUserRole,
        onError: (error: any) => {
            toast({
                title: "Error fetching user role",
                description: error?.response?.data?.message || error.message || "Unknown error",
                status: "error",
                duration: null,
                isClosable: true,
                position: "top"
            });
        },

    });



    // let email = "";
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newEmail = formData.get("email") as string;
        setEmail(newEmail);
        // alert("Email entered: " + newEmail);

        try {
            const response = await mutateAsync(newEmail);
            console.log("User role fetched successfully for:", response);
            // alert(email + "," + response.erpSystemResponse.userPOJO?.userId);
            setUserId(response.erpSystemResponse.userPOJO?.userId || -1);
            // console.log("Mutation result:", result.erpSystemResponse.userPOJO, "222222");
        } catch (err) {
            console.error("Error fetching user role:", err);
        }
    };


    const systemRoles = data ? data.erpSystemResponse.lstMetaData[0].value.split(",") : [];
    // const userRoles = data ? data.erpSystemResponse?.userPOJO?.rolesList?.split(",") : [];
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const { mutateAsync: updateRoles } = useMutation({
        mutationFn: (updateUserRoleType: UpdateUserRoleType) => updateUserRoles(updateUserRoleType),

        onError: (error: any) => {
            toast({
                title: "Error updating roles",
                description: error?.response?.data?.message || error.message || "Unknown error",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },

    });

    const toast = useToast();

    const handleUpdateRoles = async () => {
        if (!email) {
            toast({ title: "Please enter an email first", status: "warning" });
            return;
        }

        const rolesString = selectedRoles.join(","); // 👈 comma separated string
        try {
            const result = await updateRoles({ userId: userId, rolesList: rolesString });
            toast({ title: "Roles updated successfully!", status: "success" });
            console.log("Updated roles:", result);
        } catch (err) {
            toast({ title: "Error updating roles", status: "error" });
            console.error("Error updating roles:", err);
        }
    };


    return (
        <>
            <HStack>

                <Box border="1px" borderColor="gray.200" p={4} borderRadius="md">
                    <form onSubmit={(e) => { handleSubmit(e); }} >
                        <SimpleGrid columns={2}
                            columnGap={3} rowGap={5} spacing={10} width={"full"}>

                            <GridItem colSpan={1}>
                                <FormControl>
                                    <FormLabel>Enter email id / Login Id of user </FormLabel>
                                    <Input placeholder="Enter email id for updating role"
                                        _hover={{ borderColor: "green.500" }}
                                        borderColor="blue.400"
                                        borderWidth="2px"
                                        name="email"
                                    />
                                </FormControl>
                            </GridItem>


                            <GridItem colSpan={2}>
                                <FormControl>
                                    <Button type="submit" colorScheme="blue">Get User Details</Button>
                                </FormControl>
                            </GridItem>


                        </SimpleGrid>

                    </form>
                </Box>

                <Box border="1px" borderColor="gray.200" p={4} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold" mb={4}> Role Available in the System</Text>
                    {data ? (

                        <Box border="1px" borderColor="gray.200" p={4} borderRadius="md">

                            {data ? (
                                <Box border="1px" borderColor="gray.200" p={4} borderRadius="md">
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                                        Roles Available in the System
                                    </Text>
                                    {systemRoles.length > 0 ? (
                                        <CheckboxGroup
                                            value={selectedRoles}
                                            onChange={(values) => setSelectedRoles(values as string[])}
                                        >
                                            <Stack spacing={2}>
                                                {systemRoles.map((role: string) => (
                                                    <Checkbox key={role} value={role}>
                                                        {role}
                                                    </Checkbox>
                                                ))}
                                            </Stack>
                                        </CheckboxGroup>
                                    ) : (
                                        <Text>No roles available</Text>
                                    )}
                                    <Button mt={4} colorScheme="green" onClick={handleUpdateRoles}>
                                        Update Roles
                                    </Button>
                                </Box>


                            ) : (
                                <Text>No user data available</Text>
                            )
                            }
                        </Box>


                    ) : (
                        <Text>No user data available</Text>
                    )}
                </Box>



                <Box border="1px" borderColor="gray.200" p={4} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold" mb={4}> User Details Fetched</Text>
                    {data ? (
                        <Box mb={2}>
                            <Text>Full Name: {data.erpSystemResponse.userPOJO.firstName} {data.erpSystemResponse.userPOJO.lastName}</Text>

                            <Text>
                                Roles List:{" "}
                                {data.erpSystemResponse.userPOJO.rolesList ?? "No roles assigned"}
                            </Text>
                        </Box>

                    ) : (
                        <Text>No user data available</Text>
                    )}



                </Box>
            </HStack >



        </>
    )
}




export default Role