import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import PersonalDetails from "./PersonalDetails"
import EnrollStudent from "../student/EnrollStudent"
import StudentDetails from "../student/StudentDetails"

const Profile = () => {
    return (
        <Tabs variant="soft-rounded" colorScheme="purple" mb={4} >
            <TabList >
                <Tab _selected={{ color: "white", bg: "purple.400" }} >
                    Personal Details
                </Tab>
                <Tab _selected={{ color: "white", bg: "purple.400" }}>
                    Plan Details
                </Tab>
                <Tab _selected={{ color: "white", bg: "purple.400" }}>
                    Student List
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <PersonalDetails></PersonalDetails>
                </TabPanel>
                <TabPanel>
                    <EnrollStudent></EnrollStudent>
                </TabPanel>
                <TabPanel>
                    <StudentDetails></StudentDetails>
                </TabPanel>

            </TabPanels>
        </Tabs>
    )
}

export default Profile