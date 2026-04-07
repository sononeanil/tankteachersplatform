import { Button, HStack, VStack } from "@chakra-ui/react"
import { NavLink, Outlet } from "react-router-dom"

const GenerateNotes = () => {
    return (
        <>
            <VStack w="100%">
                <HStack spacing={4} w="100%" justify="center" flexWrap="wrap">

                    <Button
                        as={NavLink}
                        to="/db2/generateNotesPDF/newNotes"
                        colorScheme="blue"
                        variant="outline"
                        w={["100%", "auto"]}
                    >
                        Generate Notes from PDF
                    </Button>

                    <Button
                        as={NavLink}
                        to="/db2/generateNotesPDF/viewNotes"
                        colorScheme="blue"
                        variant="outline"
                        w={["100%", "auto"]}
                    >
                        View Existing Notes
                    </Button>

                </HStack>

                <Outlet />
            </VStack>
        </>
    )
}

export default GenerateNotes