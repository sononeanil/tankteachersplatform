import {
    Box,
    Button,
    Container,
    Heading,
    SimpleGrid,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react"
// import { useGetUpcomingZoomMeetings } from "../tanstack/zoomTanstack"
import dayjs from "dayjs"
import { useGetUpcomingZoomMeetings } from "../../tanstack/zoomTanstack"

const StudentZoomDashboard = () => {
    const { data, isLoading, error } = useGetUpcomingZoomMeetings()

    if (isLoading) {
        return (
            <VStack mt={10}>
                <Spinner size="xl" />
                <Text>Loading upcoming classes...</Text>
            </VStack>
        )
    }

    if (error) {
        return (
            <VStack mt={10}>
                <Text color="red.500">Failed to load upcoming classes.</Text>
            </VStack>
        )
    }

    if (!data || data.length === 0) {
        return (
            <VStack mt={10}>
                <Text>No upcoming meetings found.</Text>
            </VStack>
        )
    }

    return (
        <Container maxW="container.lg" py={10}>
            <Heading mb={6}>Upcoming Classes</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {data.map((meeting: any) => (
                    <Box
                        key={meeting.meetingId}
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="md"
                        _hover={{ shadow: "lg" }}
                    >
                        <Heading fontSize="xl" mb={2}>
                            {meeting.meetingTopic}
                        </Heading>
                        <Text mb={1}>
                            <strong>Start Time:</strong>{" "}
                            {dayjs(meeting.startTime).format("DD MMM YYYY, hh:mm A")}
                        </Text>
                        <Text mb={1}>
                            <strong>Duration:</strong> {meeting.duration} mins
                        </Text>
                        <Text mb={1}>
                            <strong>Organizer:</strong> {meeting.organizerEmail}
                        </Text>
                        <Text mb={1}>
                            <strong>Password:</strong> {meeting.password}
                        </Text>
                        <Button
                            colorScheme="blue"
                            size="sm"
                            mt={3}
                            onClick={() => window.open(meeting.joinUrl, "_blank")}
                        >
                            Join Meeting
                        </Button>
                    </Box>
                ))}
            </SimpleGrid>
        </Container>
    )
}

export default StudentZoomDashboard