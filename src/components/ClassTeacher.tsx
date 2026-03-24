import { Button, Flex } from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";

const ClassTeacher = () => {
    return (
        <>
            <Flex
                direction={{ base: "column", md: "row" }}
                bgGradient="linear(to-r, teal.400, blue.500)"
                p={4}
                borderRadius="md"
                gap={4}
            >
                <Button
                    as={NavLink}
                    to="/db2/classTeacher/publish"
                    w={{ base: "100%", md: "auto" }}
                    colorScheme="yellow"
                >
                    📢 Publish
                </Button>

                <Button
                    as={NavLink}
                    to="/db2/classTeacher/createZoomMeeting"
                    w={{ base: "100%", md: "auto" }}
                    colorScheme="pink"
                >
                    🎥 Create Zoom Meeting
                </Button>

                <Button
                    as={NavLink}
                    to="/db2/classTeacher/myUpcomingMeetings"
                    w={{ base: "100%", md: "auto" }}
                    colorScheme="pink"
                >
                    🎥 My upcoming Meetings
                </Button>
            </Flex>

            <Outlet />
        </>
    );
};

export default ClassTeacher;