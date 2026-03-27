import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
    AllCommunityModule,
    ModuleRegistry,
    type ColDef,
    type ICellRendererParams,
} from "ag-grid-community";

import {
    Box,
    Input,
    Select,
    Stack,
    Text,
    Button,
    Collapse,
    Flex,
    useBreakpointValue,
} from "@chakra-ui/react";

import { usePublishCourseList } from "../../tanstack/publishCoursesTanstack";
import type { PublishCourseType } from "../../types/publishCourseTypes";
import { useNavigate } from "react-router-dom";
// import { get } from "react-hook-form";
import { getLoggedinUserEmailId } from "../../service/ApiClient";

// ✅ Register once
ModuleRegistry.registerModules([AllCommunityModule]);

const ListAllCourse = () => {

    const loggedInUserEmailId = getLoggedinUserEmailId();
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = usePublishCourseList();

    const isMobile = useBreakpointValue({ base: true, md: false });

    const [searchText, setSearchText] = useState("");
    const [searchField, setSearchField] = useState("courseName");
    const [openId, setOpenId] = useState<number | null>(null);

    const handleRegister = (courseId: number) => {
        // alert(loggedInUserEmailId ? `Registering for course ID: ${courseId}` : "Please log in to register");
        if (loggedInUserEmailId) {
            navigate(`/db2/registerCourse?courseId=${courseId}`);
        } else {
            navigate(`/login?courseId=${courseId}`);
        }
    };

    // ✅ Desktop ColumnDefs
    const columnDefs: ColDef<PublishCourseType>[] = [
        {
            headerName: "Register",
            cellRenderer: (params: ICellRendererParams<PublishCourseType>) => (
                <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() =>
                        handleRegister(params.data?.id!)
                    }
                >
                    Go
                </Button>
            ),
        },
        { headerName: "Course Name", field: "courseName", flex: 1 },
        { headerName: "Fee", field: "fee" },
        { headerName: "Topic", field: "specificTopic" },
        { headerName: "Teacher", field: "organizerEmailId" },
        { headerName: "Start Time", field: "batchStartTime" },
        { headerName: "Days", field: "numberOfDays" },
        { headerName: "Hours", field: "numberOfHourse" },
        { headerName: "Mode", field: "modeOfDelivery" },
    ];

    const defaultColDef: ColDef<PublishCourseType> = {
        flex: 1,
        minWidth: 120,
        sortable: true,
        filter: true,
        resizable: true,
    };

    if (isLoading) return <Text p={4}>Loading...</Text>;
    if (isError) return <Text p={4}>{(error as Error).message}</Text>;

    // 📱 MOBILE FILTER LOGIC
    const filteredData = data?.filter((course: PublishCourseType) => {
        const value = course[searchField as keyof PublishCourseType];
        return value
            ?.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase());
    });

    // 📱 MOBILE VIEW
    if (isMobile) {
        return (
            <Box p={4}>
                {/* 🔍 Search */}
                <Flex gap={2} mb={4} direction="column">
                    <Select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                    >
                        <option value="courseName">Course Name</option>
                        <option value="specificTopic">Topic</option>
                        <option value="organizerEmailId">Teacher</option>
                        <option value="modeOfDelivery">Mode</option>
                    </Select>

                    <Input
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Flex>

                {/* 📚 List */}
                <Stack spacing={3}>
                    {filteredData?.map((course: PublishCourseType) => (
                        <Box
                            key={course.id}
                            borderWidth="1px"
                            borderRadius="lg"
                            p={4}
                        >
                            {/* Header */}
                            <Flex
                                justify="space-between"
                                align="center"
                                cursor="pointer"
                                onClick={() =>
                                    setOpenId(
                                        openId === course.id ? null : course.id!
                                    )
                                }
                            >
                                <Box>
                                    <Text fontWeight="bold">
                                        {course.courseName}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {course.specificTopic}
                                    </Text>
                                </Box>

                                <Text fontWeight="bold">₹{course.fee}</Text>
                            </Flex>

                            {/* Expand */}
                            <Collapse in={openId === course.id}>
                                <Box mt={3}>
                                    <Text>👨‍🏫 {course.organizerEmailId}</Text>
                                    <Text>🕒 {course.batchStartTime}</Text>
                                    <Text>📅 {course.numberOfDays} days</Text>
                                    <Text>⏱ {course.numberOfHourse} hours</Text>
                                    <Text>📦 {course.modeOfDelivery}</Text>

                                    <Button
                                        mt={3}
                                        colorScheme="blue"
                                        w="100%"
                                        onClick={() => handleRegister(course.id!)}
                                    >
                                        Register
                                    </Button>
                                </Box>
                            </Collapse>
                        </Box>
                    ))}
                </Stack>
            </Box>
        );
    }

    // 💻 DESKTOP VIEW (AG GRID)
    return (
        <Box p={4}>
            {/* 🔍 Quick search */}
            <Input
                placeholder="Search courses..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                mb={4}
            />

            <Box w="100%" overflowX="auto">
                <Box className="ag-theme-alpine" h="500px">
                    <AgGridReact<PublishCourseType>
                        rowData={data as PublishCourseType[]}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        quickFilterText={searchText}
                        rowHeight={50}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ListAllCourse;