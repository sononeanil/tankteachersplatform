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
        console.log("Chapter Notes Data: 1111111111", data);
        if (data?.notes) {
            navigate("chapterNotes", {
                state: {
                    subject,
                    chapterName: chapter,
                    notes: data.notes,     // ✅ FIXED
                    summary: data.summary,
                    questions: data.notes.questions,
                },
                replace: true // 👈 avoids history stacking
            });
        }
    }, [data, navigate]);


    return (
        <>

            <HStack align="start" spacing={6} w="100%">

                {/* LEFT PANEL */}
                <Box
                    w="350px"
                    mt={10}
                    p={8}
                    borderRadius="xl"
                    boxShadow="lg"
                    bg="white"
                >
                    <VStack spacing={6} align="stretch">
                        <Heading size="md">Select your Notes</Heading>

                        <Divider borderColor="gray.900" />

                        <FormControl>
                            <FormLabel>Board</FormLabel>
                            <Select onChange={(e) => setBoard(e.target.value)}>
                                <option value="">Select Board</option>
                                <option value="cbse">CBSE</option>
                                <option value="icse">ICSE</option>
                                <option value="ssc">SSC</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Class</FormLabel>
                            <Select onChange={(e) => setStudentClass(e.target.value)}>
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
                            <Select onChange={(e) => setSubject(e.target.value)}>
                                <option value="">Select Subject</option>
                                <option value="Science">Science</option>
                                <option value="english">English</option>
                            </Select>
                        </FormControl>

                        <HStack spacing={4}>

                            <FormControl>
                                <FormLabel>Chapter</FormLabel>
                                <Select onChange={(e) => setChapter(e.target.value)}>
                                    {isChapterLoading ? "Loading..." : "Select Chapter"}
                                    <option value="">Select Subject</option>

                                    {chapterList?.map((chapter: string) => (
                                        <option key={chapter} value={chapter}>
                                            {"Chapter " + chapter}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>

                        <Divider borderColor="blue.400" />

                        <Button
                            size="lg"
                            colorScheme="blue"
                            onClick={() => refetch()}
                            isLoading={isLoading}
                            isDisabled={!isFormValid}
                        >
                            View Notes
                        </Button>


                    </VStack>
                </Box>

                {/* RIGHT PANEL */}
                <Box
                    flex="1"
                    mt={10}
                    p={4}
                    minH="500px"
                    borderRadius="xl"
                    bg="gray.50"
                >
                    {/* 👇 THIS IS THE KEY */}
                    <Outlet />

                    {/* 👇 fallback when no notes */}
                    {!data && !isLoading && (
                        <Text color="gray.500">
                            📚 Select a chapter and click "View Notes"
                        </Text>
                    )}
                </Box>

            </HStack>
        </>
    )
}

export default ViewNotes