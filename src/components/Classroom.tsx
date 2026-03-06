import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, HStack, SimpleGrid, Text } from "@chakra-ui/react"
import { classroomTypeList } from "../types/ClassroomTypes"
import { EditIcon, ViewIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router"


const Classroom = () => {
    const navigate = useNavigate();
    return (
        <SimpleGrid spacing={10} minChildWidth={"300px"}>
            {
                classroomTypeList.map((classroom) => (
                    <Card key={classroom.id}
                        borderTop={"8px solid green"}
                        bgGradient="linear(to-r, red.100, blue.300)"
                        shadow={"2xl"}
                    // border={"1px solid red"}
                    >
                        <CardHeader >
                            <Flex alignItems={"center"}>
                                <Box boxSize={"50px"} bg={"blackAlpha.800"}
                                    borderRadius={"full"} display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    marginRight={4}>
                                    <Text color={"whiteAlpha.900"}> AV </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={"xl"}
                                        fontWeight={"bold"}>{classroom.name}</Text>
                                </Box>
                            </Flex>
                        </CardHeader>
                        <Divider borderColor={"blackAlpha.700"}></Divider>
                        <CardBody color="slategrey">
                            <Text>  {classroom.accessLevel}</Text>
                        </CardBody>
                        <CardFooter>
                            <HStack spacing={4}>
                                <Button colorScheme="green" variant={"outline"}
                                    leftIcon={<EditIcon></EditIcon>}>Select</Button>
                                <Button onClick={() => navigate(`/db2/classroom/classromDetails/${classroom.id}`)} colorScheme="red" variant="outline" leftIcon={<ViewIcon></ViewIcon>}>Learn More</Button>
                            </HStack>
                        </CardFooter>
                    </Card>))
            }
        </SimpleGrid>
    )
}

export default Classroom