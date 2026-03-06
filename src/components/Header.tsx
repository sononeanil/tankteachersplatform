import { Avatar, Box, HStack, IconButton, Image, Input, InputGroup } from "@chakra-ui/react"
import SidebarDrawer from "./SidebarDrawer"

import ChildStudyPlatform1 from "./images/ChildStudyPlatform1.png";
import { LuSearch } from "react-icons/lu";
import { BiBell } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { ColorModeButton } from "./ui/color-mode";
import { useState } from "react";


const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (

        <HStack justify={"space-between"} my={"10px"} mx={"20px"} mb={"40px"}>

            <HStack hideFrom={"md"}>
                <Box >
                    <SidebarDrawer></SidebarDrawer>
                </Box>
                <Box>

                    <Image src={ChildStudyPlatform1} alt="Tanstack Logo" boxSize="50px" />
                </Box>
            </HStack>

            <HStack justify={"end"}>
                <InputGroup flex={"1"}>
                    <Input placeholder="....search" />
                </InputGroup>
                <IconButton aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)} >
                    {isSearchOpen ? <CgClose /> : <LuSearch />}
                </IconButton>
                <ColorModeButton></ColorModeButton>
                <IconButton aria-label="User Profile" rounded={"full"} >
                    <BiBell></BiBell>
                </IconButton>

                <Avatar />
            </HStack>

        </HStack>

    )
}

export default Header