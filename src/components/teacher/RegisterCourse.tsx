import { useSearchParams } from "react-router-dom";
import { useGetCourseDetails, useRegisterCourse } from "../../tanstack/publishCoursesTanstack";
import {
    Box,
    Heading,
    Text,
    Stack,
    Divider,
    Badge,
    Button,
    Flex
} from "@chakra-ui/react";

const RegisterCourse = () => {
    const [searchParams] = useSearchParams();
    const courseIdParam = searchParams.get("courseId");
    const userInfoString = localStorage.getItem("loggedInUser");
    const loggedInUser = userInfoString ? JSON.parse(userInfoString) : null;
    const courseId = Number(courseIdParam);
    const { data, isLoading, isError, error } = useGetCourseDetails(courseId);
    const registerForCourseMutation = useRegisterCourse();

    const handleRegister = () => {
        registerForCourseMutation.mutate({
            id: 0,
            courseId: Number(courseIdParam) || 0,
            organizerEmailId: data?.organizerEmailId || "",
            studentEmailId: loggedInUser.email
        });
    }

    if (!courseIdParam || isNaN(courseId)) {
        return <Text textAlign="center" mt={5}>Invalid course ID</Text>;
    }

    if (isLoading) return <Text textAlign="center">Loading course details...</Text>;

    if (isError) return <Text textAlign="center" color="red.500">Error: {error.message}</Text>;

    return (
        <Flex justify="center" mt={10}>
            <Box
                maxW="650px"
                w="100%"
                p={6}
                borderRadius="xl"
                boxShadow="lg"
                border="1px solid"
                borderColor="gray.200"
                bg="white"
            >
                {/* Title */}
                <Heading size="lg" mb={2} color="gray.700">
                    {data?.courseName}
                </Heading>

                {/* Description */}
                <Text color="gray.600" mb={4}>
                    {data?.description}
                </Text>

                <Divider />

                {/* Details */}
                <Stack spacing={3} mt={4}>
                    <Text><b>📘 Topic:</b> {data?.specificTopic}</Text>
                    <Text><b>🎯 Audience:</b> {data?.targatedAudience}</Text>
                    <Text>
                        <b>⏱ Duration:</b> {data?.numberOfDays} days / {data?.numberOfHourse} hrs
                    </Text>
                    <Text><b>💻 Mode:</b> {data?.modeOfDelivery}</Text>

                    <Text>
                        <b>💰 Fee:</b>{" "}
                        {data?.fee === 0 ? (
                            <Badge colorScheme="green" fontSize="0.9em">FREE</Badge>
                        ) : (
                            `₹${data?.fee}`
                        )}
                    </Text>

                    <Text>
                        <b>📅 Start Time:</b>{" "}
                        {data?.batchStartTime
                            ? new Date(data.batchStartTime).toLocaleString()
                            : "N/A"}
                    </Text>

                    <Text><b>📧 Organizer:</b> {data?.organizerEmailId}</Text>
                </Stack>

                {/* Button */}
                <Button
                    mt={6}
                    width="100%"
                    colorScheme="blue"
                    size="lg"
                    onClick={handleRegister}
                    isLoading={registerForCourseMutation.isPending}
                >
                    Confirm Registration
                </Button>
            </Box>
        </Flex>
    );
};

export default RegisterCourse;