import { HStack, VStack } from "@chakra-ui/react"
import { NavLink, Outlet } from "react-router-dom"

const GenerateNotes = () => {
    return (
        <>
            <VStack>
                <HStack>
                    <NavLink to="/db2/generateNotesPDF/newNotes">Generate Your own Notes from PDF</NavLink>
                    <NavLink to="/db2/generateNotesPDF/viewNotes">View Existing Notes</NavLink>
                </HStack>
                <Outlet></Outlet>
            </VStack>
        </>
    )
}

export default GenerateNotes