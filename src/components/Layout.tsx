import { Box, Flex } from "@chakra-ui/react"
import Sidebar from "./ui/Sidebar"
import Header from "./Header"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (


        <>
            <Flex>

                <Box w={"30%"} border={"solid 2px red"}>
                    {/* Sidebar could go here */}
                    <Sidebar></Sidebar>
                </Box>
                <Box w={"full"} border={"solid 2px red"} p={4} mx={"10px"}>
                    {/* Main content could go here */}
                    <Header></Header>
                    <Outlet></Outlet>
                </Box>

            </Flex>

        </>

    )
}

export default Layout