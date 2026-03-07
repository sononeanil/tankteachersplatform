import { Box, Button, Flex, Grid, GridItem, Heading, HStack, List, ListItem, Spacer, Text, Badge } from "@chakra-ui/react"
import { AiOutlineDashboard, AiOutlineTeam, AiOutlineUser } from "react-icons/ai"
import { MdOutlineClass, MdWeb } from "react-icons/md"
import { FaChalkboardTeacher, FaSchool } from "react-icons/fa"
import { HiStar } from "react-icons/hi"
import { NavLink, Outlet, useNavigate } from "react-router"


const Dashboard2 = () => {

    // Get user info from localStorage
    const userInfoString = localStorage.getItem("loggedInUser");
    // console.log(JSON.parse(userInfoString));
    // const loggedInUser = ""
    const loggedInUser = userInfoString ? JSON.parse(userInfoString) : null;



    const navItems = [
        { lable: "Dashboard", icon: <AiOutlineDashboard />, path: "landingPage" },
        { lable: "Families", icon: <AiOutlineTeam />, path: "chakraUi1" },
        { lable: "Class room", icon: <MdOutlineClass />, path: "classroom" },
        { lable: "Teacher", icon: <FaChalkboardTeacher />, path: "classTeacher" },
        { lable: "School", icon: <FaSchool />, path: "school" },
        { lable: "Profile", icon: <AiOutlineUser />, path: "profile" },
        // { lable: "Landing Page", icon: <MdWeb />, path: "landingpage2" },
        { lable: "Upload Assignment", icon: <MdWeb />, path: "upload" },
        { lable: "Publish", icon: <MdWeb />, path: "publish" },
        { lable: "Edit Role", icon: <MdWeb />, path: "editRole" },
        { lable: "User Details", icon: <AiOutlineUser />, path: "userdetails" },
        { lable: "SetUp Zoom Meeting", icon: <AiOutlineUser />, path: "createZoomMeeting" },
        { lable: "Zoom Meeting", icon: <AiOutlineUser />, path: "zoomMeeting" }
    ];
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
    }
    return (

        <Grid templateColumns="repeat(6, 1fr)" minH="100vh">
            <GridItem as={"aside"}
                colSpan={1}
                bg="teal.200"
                p="20px"
                bgGradient="linear(to-b, red.100, blue.300, green.500)" py={20}>

                <List spacing={3} fontSize="20px">
                    {navItems.map((item, index) => (<ListItem key={index}>
                        <NavLink to={item.path} style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center", gap: "5px",
                            color: isActive ? "#d50909ff" : "#031652ff",
                            // fontWeight: isActive ? "bold" : "normal",
                            textDecoration: "none",
                        })}>{item.icon}{item.lable}
                        </NavLink>
                    </ListItem>))}

                </List>
            </GridItem>
            <GridItem colSpan={5} >
                <Flex as="nav" p={"10px"} alignItems="center"
                    bgGradient="linear(to-r, indigo, purple.500, pink.500)"
                    color={"white"}>
                    <Heading>TANK Sudent Portal</Heading>
                    <Spacer />
                    <HStack >
                        <Badge variant="solid" colorScheme="red">
                            <HiStar />
                            New
                        </Badge>
                        <Box ml="20px" fontSize={"20px"} bg={"green.400"}> SP </Box>
                        <Text ml="20px" fontSize={"20px"}>{loggedInUser.email} </Text>
                        <Button ml="20px" colorScheme={"teal"} onClick={handleLogout}>

                            Logout </Button>
                    </HStack>
                </Flex>
                <Box m={"20px"}> <Outlet></Outlet></Box>

            </GridItem>



        </Grid>
    )
}

export default Dashboard2