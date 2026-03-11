import {
    Box,
    Button,
    Heading,
    Stack,
    Text,
    Spinner
} from "@chakra-ui/react"

import { useGetUpcomingZoomMeetingsForTeacher } from "../../tanstack/zoomTanstack"

const userInfoString = localStorage.getItem("loggedInUser")
const loggedInUser = userInfoString ? JSON.parse(userInfoString) : null

const UpcomingMeeting = () => {

    const { data, isLoading, error } =
        useGetUpcomingZoomMeetingsForTeacher(loggedInUser.email)

    if (isLoading) return <Spinner />

    if (error) return <Text>Error loading meetings</Text>

    return (

        <Box p={6}>

            <Heading size="md" mb={5}>
                Upcoming Meetings
            </Heading>

            <Stack spacing={4}>

                {data?.map((meeting) => (

                    <Box
                        key={meeting.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        shadow="md"
                    >

                        <Text fontSize="lg" fontWeight="bold">
                            {meeting.meetingTopic}
                        </Text>

                        <Text>
                            Start Time: {new Date(meeting.startTime).toLocaleString()}
                        </Text>

                        <Text>
                            Duration: {meeting.duration} minutes
                        </Text>

                        <Button
                            mt={3}
                            colorScheme="green"
                            onClick={() => window.open(meeting.startUrl, "_blank")}
                        >
                            Start Meeting
                        </Button>

                    </Box>

                ))}

            </Stack>

        </Box>
    )
}

export default UpcomingMeeting