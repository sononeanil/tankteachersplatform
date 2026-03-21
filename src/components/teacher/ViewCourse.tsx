import {
    Box,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Heading,
    Text,
    Button,
    Stack,
    Badge,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { usePublishCourseListTop6 } from "../../tanstack/publishCoursesTanstack";
import { EmailIcon } from "@chakra-ui/icons";



const ViewCourse = () => {
    const { data } = usePublishCourseListTop6();
    const navigate = useNavigate();


    return (
        <Box
            // bgGradient="linear(to-r, green.50, blue.50)"
            minH="100vh"
            p={6}

        >
            <Heading
                mb={6}
                textAlign="center"
                bgGradient="linear(to-r, teal.400, green.500, purple.600)"
                bgClip="text"
                fontWeight="medium"
            >

                Explore Courses - completly free to create and sell your courses onlines
            </Heading >
            <Link to="/listAllCourse"
                style={{
                    color: "teal", fontWeight: "bold",
                    textDecoration: "underline", marginBottom: "20px", display: "block"
                }}>
                List All Courses
            </Link>
            <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                {data?.map((course) => (
                    <Card key={course.id}
                        bg="linear-gradient(#80eff7ff, #f2c1c1ff)"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(255, 255, 255, 0.3)"
                        borderRadius="2xl"
                        boxShadow="lg"
                        color="black"
                        _hover={{
                            transform: "translateY(-5px)",
                            boxShadow: "2xl"
                        }}
                    >
                        {/* <Image src={course.image} alt={course.title} /> */}

                        <CardHeader>
                            <Stack direction="row" justify="space-between" align="center">
                                <Heading size="md">{course.courseName}</Heading>
                                <Badge colorScheme="purple">{course.modeOfDelivery}</Badge>
                            </Stack>
                            <Text fontSize="sm" color="gray.600">

                            </Text>

                            <Text fontSize="sm" fontWeight="medium">
                                Hosted By <EmailIcon /> : {course.organizerEmailId}
                            </Text>
                        </CardHeader>

                        <CardBody>
                            <Text fontSize="sm" color="gray.600">
                                {course.description}
                            </Text>
                        </CardBody>

                        <CardFooter justify="space-between" >
                            <Text fontWeight="bold">{"\u20B9"}{course.fee}</Text>
                            <Button colorScheme="teal" size="sm"
                                onClick={() => navigate(`/login?courseId=${course.id}`)}
                            >
                                Register
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </SimpleGrid>
            <Link to="/listAllCourse"
                style={{
                    color: "teal", fontWeight: "bold",
                    textDecoration: "underline", marginTop: "20px", display: "block"
                }}>
                List All Courses
            </Link>
        </Box>
    );
};

export default ViewCourse;