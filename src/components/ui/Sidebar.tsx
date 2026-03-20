import { Box, Image, Text, VStack } from "@chakra-ui/react"
import { AiFillAlipaySquare, AiOutlineDashboard, AiOutlineTeam } from "react-icons/ai"
import { MdAddTask } from "react-icons/md"
import ChildStudyPlatform1 from "../images/ChildStudyPlatform3.png";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const navItems = [
        { lable: "Dashboard", icon: <AiOutlineDashboard />, path: "landingPage" },
        { lable: "Families", icon: <AiOutlineTeam />, path: "chakraUi1" },
        { lable: "Class room", icon: <MdAddTask />, path: "classroom" },
        { lable: "Teacher", icon: <AiFillAlipaySquare />, path: "classTeacher" },
        { lable: "School", icon: <AiFillAlipaySquare />, path: "classTeacher" },
        { lable: "Profile", icon: <AiFillAlipaySquare />, path: "profile" },
    ]

    return (
        <>
            <VStack>
                <VStack>
                    <Box>
                        <Image src={ChildStudyPlatform1} alt="Tanstack Logo" boxSize="50px" />
                        <Text fontSize="lg" fontWeight="bold">Child Study Platform</Text>
                    </Box>
                </VStack>

                <VStack alignItems={"flex-start"} spacing={4} mt={8}>
                    {
                        navItems.map((item, index) => (
                            <Box key={index} display="flex" alignItems="center" cursor="pointer" _hover={{ bg: "gray.200" }} p={2} borderRadius="md" width="100%">
                                <NavLink to={`/${item.path}`}>
                                    <Box mr={2}>{item.icon}</Box>
                                    <Text>{item.lable}</Text>
                                </NavLink>
                            </Box>
                        ))
                    }
                </VStack>

            </VStack>
        </>
    )
}

export default Sidebar