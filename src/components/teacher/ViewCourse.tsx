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
    Image,
    Stack,
    Badge
} from "@chakra-ui/react";

const courses = [
    {
        id: 1,
        title: "React for Beginners",
        description: "Learn React from scratch with hands-on projects.",
        image: "https://via.placeholder.com/300",
        level: "Beginner",
        price: "₹999"
    },
    {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master closures, async JS, and advanced concepts.",
        image: "https://via.placeholder.com/300",
        level: "Advanced",
        price: "₹1499"
    },
    {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master closures, async JS, and advanced concepts.",
        image: "https://via.placeholder.com/300",
        level: "Advanced",
        price: "₹1499"
    },
    {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master closures, async JS, and advanced concepts.",
        image: "https://via.placeholder.com/300",
        level: "Advanced",
        price: "₹1499"
    },
    {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master closures, async JS, and advanced concepts.",
        image: "https://via.placeholder.com/300",
        level: "Advanced",
        price: "₹1499"
    },
    {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master closures, async JS, and advanced concepts.",
        image: "https://via.placeholder.com/300",
        level: "Advanced",
        price: "₹1499"
    },

];

const ViewCourse = () => {
    return (
        <Box
            // bgGradient="linear(to-r, green.50, blue.50)"
            minH="100vh"
            p={6}
        >
            <Heading mb={6} textAlign="center">
                Explore Courses
            </Heading>

            <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                {courses.map((course) => (
                    <Card
                        bg="rgba(40, 27, 231, 0.15)"
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
                        <Image src={course.image} alt={course.title} />

                        <CardHeader>
                            <Stack direction="row" justify="space-between" align="center">
                                <Heading size="md">{course.title}</Heading>
                                <Badge colorScheme="purple">{course.level}</Badge>
                            </Stack>
                        </CardHeader>

                        <CardBody>
                            <Text fontSize="sm" color="gray.600">
                                {course.description}
                            </Text>
                        </CardBody>

                        <CardFooter justify="space-between" align="center">
                            <Text fontWeight="bold">{course.price}</Text>

                            <Button colorScheme="teal" size="sm">
                                Register
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default ViewCourse;