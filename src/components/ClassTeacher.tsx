import { Button, Flex } from "@chakra-ui/react"
import { NavLink, Outlet } from "react-router"

const ClassTeacher = () => {
    return (
        <>
            <Flex
                bgGradient="linear(to-r, teal.400, blue.500)"
                p={4}
                borderRadius="md"
                gap={4}
            >
                <Button
                    as={NavLink}
                    to="/db2/classTeacher/publish"
                    variant="solid"
                    colorScheme="yellow"
                    _activeLink={{ bg: "white", color: "teal.500", fontWeight: "bold" }}
                >
                    📢 Publish
                </Button>

                <Button
                    as={NavLink}
                    to="/db2/classTeacher/createZoomMeeting"
                    variant="solid"
                    colorScheme="pink"
                    _activeLink={{ bg: "white", color: "pink.500", fontWeight: "bold" }}
                >
                    🎥 Create Zoom Meeting
                </Button>
            </Flex>

            <Outlet></Outlet>
        </>
    )
}

export default ClassTeacher