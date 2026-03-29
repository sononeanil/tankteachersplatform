import {
    Box, Button, Flex, Grid, GridItem, Heading, HStack,
    List, ListItem, Spacer, Text, IconButton, useDisclosure
} from "@chakra-ui/react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Drawer, DrawerOverlay, DrawerContent,
    DrawerBody, DrawerHeader
} from "@chakra-ui/react";
import { getLoggedinUserEmailId } from "../service/ApiClient";
import { getMenuByRoles } from "../types/SideMenuData";

const Dashboard2 = () => {

    const loggedInUser = getLoggedinUserEmailId();
    const navItems = getMenuByRoles();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <Grid
            templateColumns={{ base: "1fr", md: "250px 1fr" }}
            minH="100vh"   // ✅ important
        >
            {/* Sidebar */}
            <GridItem
                as="aside"
                display={{ base: "none", md: "block" }}
                bgGradient="linear(to-b, red.100, blue.300, green.500)"
                p="20px"
                position="sticky"   // optional but nice
                top="0"
                height="100vh"      // ✅ lock height
                overflowY="auto"    // ✅ scroll if content grows
            >
                <List spacing={3} fontSize="18px">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <ListItem key={item.path}>
                                <NavLink
                                    to={item.path}
                                    style={({ isActive }) => ({
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        color: isActive ? "rgb(248, 7, 7)" : "#031652ff",
                                        textDecoration: isActive ? "underline" : "none",
                                    })}
                                >
                                    <Icon />
                                    {item.label}
                                </NavLink>
                            </ListItem>
                        );
                    })}
                </List>
            </GridItem>

            {/* Main Content */}
            <GridItem as="main">

                {/* Top Navbar */}
                <Flex
                    as="nav"
                    p="10px"
                    alignItems="center"
                    bgGradient="linear(to-r, indigo, purple.500, pink.500)"
                    color="white"
                >
                    <IconButton
                        icon={<HamburgerIcon />}
                        display={{ base: "block", md: "none" }}
                        onClick={onOpen}   // ✅ FIXED
                        mr={2}
                        aria-label="Open menu"
                    />

                    <Heading fontSize={{ base: "md", md: "lg" }}>
                        TANK Teachers Platform
                    </Heading>

                    <Spacer />

                    <HStack spacing={3}>
                        <Box fontSize="20px" bg="green.400" px={2} borderRadius="md">
                            SP
                        </Box>
                        <Text display={{ base: "none", md: "block" }}>
                            {loggedInUser || "User"}
                        </Text>
                        <Button size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </HStack>
                </Flex>

                {/* Mobile Drawer */}
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader>Menu</DrawerHeader>
                        <DrawerBody>
                            <List spacing={3}>
                                {navItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <ListItem key={item.path}>
                                            <NavLink
                                                to={item.path}
                                                onClick={onClose}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Icon />
                                                {item.label}
                                            </NavLink>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Page Content */}
                <Box m={{ base: "10px", md: "20px" }}>
                    <Outlet />
                </Box>

            </GridItem>
        </Grid>
    );
};

export default Dashboard2;