import {
    Box,
    Button,
    Select,
    Text,
    VStack,
    FormControl,
    FormLabel,
    Heading,
    Divider,
    HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useChapterList, useChapterNotes } from "../../tanstack/notesTanstack";
const ViewNotes = () => {
    const [studentClass, setStudentClass] = useState("");
    const [board, setBoard] = useState("");

    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        setChapter("");
    }, [subject]);



    const isFormValid =
        board && studentClass && subject && chapter;
    const chapterListKey = `${board}/${studentClass}/${subject}`;
    const shouldFetchChapters = board && studentClass && subject;
    const [viewMode, setViewMode] = useState("Notes");

    const {
        data: chapterList,
        isLoading: isChapterLoading,
    } = useChapterList(
        { key: chapterListKey },
        !!shouldFetchChapters
    );
    const combinedKey = `${board}/${studentClass}/${subject}`;
    const { data, isLoading, refetch } = useChapterNotes(
        { key: combinedKey, chapter: chapter },
        false
    );

    useEffect(() => {

        if (data?.notes) {
            // console.log("Chapter Notes Data: 1111111111", data, "222222", data.notes, "33333", data.mindMap, "444444"); // 🔥 LOGGIN   G
            // Map the select value to the route path
            const targetPath = viewMode === "Notes" ? "chapterNotes" : "mindMap";
            navigate(targetPath, {
                state: {
                    subject,
                    chapterName: chapter,
                    notes: data.notes,
                    mindMap: data.mindMap,    // ✅ FIXED
                    summary: data.summary,
                    questions: data.notes.questions,
                    viewMode: viewMode, // ✅ Pass viewMode to the next page
                },
                replace: true // 👈 avoids history stacking
            });
        }
    }, [data, navigate, viewMode, subject, chapter]);


    return (
        <>

            <HStack
                align="start"
                spacing={6}
                w="100%"
                flexDirection={["column", "column", "row"]} // 🔥 key change
            >

                {/* LEFT PANEL */}
                <Box
                    w={["100%", "100%", "350px"]} // 🔥 responsive width
                    mt={4}
                    p={[4, 6, 8]} // 🔥 responsive padding
                    borderRadius="xl"
                    boxShadow="lg"
                    bg="white"
                >
                    <VStack spacing={6} align="stretch">
                        <Heading size="md" textAlign={["center", "left"]}>
                            Select your Notes
                        </Heading>

                        <Divider borderColor="gray.900" />

                        <FormControl>
                            <FormLabel>Board</FormLabel>
                            <Select size="lg" onChange={(e) => setBoard(e.target.value)}>
                                <option value="">Select Board</option>
                                <option value="cbse">CBSE</option>
                                <option value="icse">ICSE</option>
                                <option value="ssc">SSC</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Class</FormLabel>
                            <Select size="lg" onChange={(e) => setStudentClass(e.target.value)}>
                                <option value="">Select Class</option>
                                <option value="ClassVIII">Class VIII</option>
                                <option value="ClassIX">Class IX</option>
                                <option value="ClassX">Class X</option>
                                <option value="ClassXI">Class XI</option>
                                <option value="ClassXII">Class XII</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Subject</FormLabel>
                            <Select size="lg" onChange={(e) => setSubject(e.target.value)}>
                                <option value="">Select Subject</option>
                                <option value="Science">Science</option>
                                <option value="english">English</option>
                            </Select>
                        </FormControl>

                        {/* 🔥 Remove unnecessary HStack */}
                        <FormControl>
                            <FormLabel>Chapter</FormLabel>
                            <Select size="lg" onChange={(e) => setChapter(e.target.value)}>
                                <option value="">Select Chapter</option>

                                {isChapterLoading ? (
                                    <option>Loading...</option>
                                ) : (
                                    chapterList?.map((chapter: string) => (
                                        <option key={chapter} value={chapter}>
                                            {"Chapter " + chapter}
                                        </option>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>View Type</FormLabel>
                            <Select size="lg" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                                <option value="Notes">📚 Notes</option>
                                <option value="MindMap">🧠 Mind Map</option>
                            </Select>
                        </FormControl>
                        <Divider borderColor="blue.400" />

                        <Button
                            size="lg"
                            w="100%"
                            colorScheme="blue"
                            onClick={() => refetch()}
                            isLoading={isLoading}
                            isDisabled={!isFormValid}
                        >
                            View {viewMode}
                        </Button>
                    </VStack>
                </Box>

                {/* RIGHT PANEL */}
                <Box
                    flex="1"
                    mt={4}
                    p={[2, 3, 4]} // 🔥 responsive padding
                    minH={["300px", "400px", "500px"]}
                    borderRadius="xl"
                    bg="gray.50"
                >
                    <Outlet />

                    {!data && !isLoading && (
                        <Text color="gray.500" textAlign="center" mt={10}>
                            📚 Select a chapter and click "View Notes"
                        </Text>
                    )}
                </Box>

            </HStack>

        </>
    )
}

export default ViewNotes