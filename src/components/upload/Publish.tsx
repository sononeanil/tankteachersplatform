import {
    Box,
    Button,
    Input,
    Select,
    Text,
    useToast,
    VStack,
    FormControl,
    FormLabel,
    Heading,
    Divider,
    HStack,
    IconButton,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getNotesApi, uploadChapter } from "../../service/ApiUpload";

const Publish = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [studentClass, setStudentClass] = useState("");
    const [board, setBoard] = useState("");
    const [term, setTerm] = useState("");
    const [type, setType] = useState("");
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");

    const toast = useToast();
    const navigate = useNavigate();

    // ✅ Upload Mutation
    const uploadMutation = useMutation({
        mutationFn: (formData: FormData) => uploadChapter(formData),
    });

    // ✅ Get Notes Mutation
    const getNotesMutation = useMutation({
        mutationFn: getNotesApi,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0] || null);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast({
                title: "No file selected",
                description: "Please choose a file before uploading.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const destinationDirectory = `${board}/${studentClass}/${subject}/${term}/${chapter}/${type}`;
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("destinationDirectory", destinationDirectory);

        uploadMutation.mutate(formData, {
            onSuccess: (data: any) => {
                toast({
                    title: "Upload Successful",
                    description: data?.erpSystemResponse?.message || "File uploaded",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error: any) => {
                toast({
                    title: "Upload Failed",
                    description: error?.message || "Something went wrong",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            },
        });
    };

    // ✅ Get Notes Handler
    const getNotes = () => {
        getNotesMutation.mutate(undefined, {
            onSuccess: (data: any) => {
                console.log("Notes:", data);
                toast({
                    title: "Notes fetched",
                    description: "Check console for data",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error: any) => {
                toast({
                    title: "Error fetching notes",
                    description: error?.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        });
    };

    return (
        <>
            <Box
                mt={10}
                p={8}
                maxW="500px"
                mx="auto"
                borderRadius="xl"
                boxShadow="lg"
                bg="white"
            >
                <VStack spacing={6} align="stretch">

                    <Heading size="md">Upload Study Material</Heading>

                    {/* ✅ Get Notes Button */}
                    <IconButton
                        onClick={getNotes}
                        aria-label="Get Notes"
                        isLoading={getNotesMutation.isPending}
                    >
                        Get Notes
                    </IconButton>

                    <Text fontSize="sm" color="gray.500">
                        Select details and upload file for students
                    </Text>

                    <Divider />

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
                            <option value="juniorKg">Junior KG</option>
                            <option value="seniorKg">Senior KG</option>
                            <option value="first">1st class</option>
                            <option value="second">2nd class</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Subject</FormLabel>
                        <Select onChange={(e) => setSubject(e.target.value)}>
                            <option value="">Select Subject</option>
                            <option value="hindi">Hindi</option>
                            <option value="english">English</option>
                            <option value="marathi">Marathi</option>
                        </Select>
                    </FormControl>

                    <HStack spacing={4}>
                        <FormControl>
                            <FormLabel>Term</FormLabel>
                            <Select onChange={(e) => setTerm(e.target.value)}>
                                <option value="">Select Term</option>
                                <option value="term1">Term 1</option>
                                <option value="term2">Term 2</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Chapter</FormLabel>
                            <Select onChange={(e) => setChapter(e.target.value)}>
                                <option value="">Select Chapter</option>
                                <option value="chapter1">Chapter 1</option>
                                <option value="chapter2">Chapter 2</option>
                            </Select>
                        </FormControl>
                    </HStack>

                    <FormControl>
                        <FormLabel>Content Type</FormLabel>
                        <Select onChange={(e) => setType(e.target.value)}>
                            <option value="">Select Type</option>
                            <option value="practiceWorksheet">Practice Worksheet</option>
                            <option value="modelPaper">Model Paper</option>
                            <option value="assignment">Assignment</option>
                        </Select>
                    </FormControl>

                    <Divider />

                    <FormControl>
                        <FormLabel>Upload File</FormLabel>
                        <Input type="file" onChange={handleFileChange} />
                    </FormControl>

                    <Button
                        size="lg"
                        colorScheme="blue"
                        onClick={handleUpload}
                        isLoading={uploadMutation.isPending}
                    >
                        Upload File
                    </Button>

                    {uploadMutation.isError && (
                        <Text color="red.500" fontSize="sm">
                            Error: {(uploadMutation.error as any)?.message}
                        </Text>
                    )}

                    {uploadMutation.isSuccess && (
                        <Text color="green.500" fontSize="sm">
                            Upload successful!
                        </Text>
                    )}

                    <Text
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => navigate("/db2/upload/uploadedFileList")}
                    >
                        View Uploaded Files →
                    </Text>

                </VStack>
            </Box>

            <Outlet />
        </>
    );
};

export default Publish;