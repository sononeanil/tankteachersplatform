import { Box, Button, Flex, Grid, GridItem, Heading, HStack, List, ListItem, Spacer, Text } from "@chakra-ui/react"
import { AiOutlineDashboard, AiOutlineTeam, AiOutlineUser } from "react-icons/ai"
import { MdOutlineClass, MdWeb } from "react-icons/md"
import { FaChalkboardTeacher, FaSchool } from "react-icons/fa"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { IconButton, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Drawer, DrawerOverlay, DrawerContent,
    DrawerBody, DrawerHeader
} from "@chakra-ui/react";
import { getLoggedinUserEmailId } from "../service/ApiClient"
import { getMenuByRoles } from "../types/SideMenuData"
const Dashboard2 = () => {

    // Get user info from localStorage
    const loggedInUser = getLoggedinUserEmailId();




    const navItems = getMenuByRoles();
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem("jwtToken");
        sessionStorage.clear();
        navigate("/");
    }
    const { isOpen, onToggle } = useDisclosure();
    return (

        <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
            <GridItem
                as="aside"
                display={{ base: "none", md: "block" }}
                bgGradient="linear(to-b, red.100, blue.300, green.500)"
                p="20px"
            >

                <List spacing={3} fontSize="20px">
                    {navItems.map((item, index) => (<ListItem key={index}>
                        <NavLink to={item.path} style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center", gap: "5px",
                            color: isActive ? "rgb(248, 7, 7)" : "#031652ff",
                            // fontWeight: isActive ? "bold" : "normal",
                            textDecoration: isActive ? "underline" : "none",
                        })}>{item.icon}{item.label}
                        </NavLink>
                    </ListItem>))}

                </List>
            </GridItem>
            <GridItem as="main" >
                <Flex
                    as="nav"
                    p="10px"
                    alignItems="center"
                    bgGradient="linear(to-r, indigo, purple.500, pink.500)"
                    color="white"
                >
                    {/* Mobile menu button */}
                    <IconButton
                        icon={<HamburgerIcon />}
                        display={{ base: "block", md: "none" }}
                        onClick={onToggle}
                        mr={2}
                        aria-label="Open menu"
                    />

                    <Heading fontSize={{ base: "md", md: "lg" }}>
                        TANK Teachers Platform
                    </Heading>

                    <Spacer />

                    <HStack spacing={3}>
                        <Box fontSize="20px" bg="green.400">SP</Box>
                        <Text display={{ base: "none", md: "block" }}>
                            {loggedInUser || "User"}
                        </Text>
                        <Button size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </HStack>
                </Flex>
                <Drawer isOpen={isOpen} placement="left" onClose={onToggle}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader>Menu</DrawerHeader>
                        <DrawerBody>
                            <List spacing={3}>
                                {navItems.map((item, index) => (
                                    <ListItem key={index}>
                                        <NavLink to={item.path} onClick={onToggle}>
                                            {item.icon} {item.lable}
                                        </NavLink>
                                    </ListItem>
                                ))}
                            </List>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
                <Box m={{ base: "10px", md: "20px" }}>
                    <Outlet />
                </Box>

            </GridItem>



        </Grid>
    )
}

export default Dashboard2