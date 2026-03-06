import { SimpleGrid, GridItem, HStack, Button } from "@chakra-ui/react"
import { NavLink, Outlet } from "react-router"

const StudentDetails = () => {
    return (
        <SimpleGrid spacing={10}  >
            <GridItem mb={4}    >
                <HStack>
                    <Button colorScheme="blue">
                        <NavLink to="/db2/profile/enrollStudent">Enroll New Student</NavLink>
                    </Button>
                    <Button colorScheme="blue">
                        <NavLink to="/db2/profile/viewStudents">View All Student</NavLink>
                    </Button>
                </HStack>
            </GridItem>
            <GridItem>
                <Outlet></Outlet>
            </GridItem>
        </SimpleGrid>
    )
}

export default StudentDetails