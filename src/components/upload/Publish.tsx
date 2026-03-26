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
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../../Api";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
const Publish = () => {


    const useFileUpload = () => {
        return useMutation({
            mutationFn: (formData: FormData) => uploadFile(formData),
        });
    };


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [targetDirectory, setTargetDirectory] = useState(null);
    const [studentClass, setStudentClass] = useState("");
    const [board, setBoard] = useState("");
    const [term, setTerm] = useState("");
    const [type, setType] = useState("");
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");


    const toast = useToast();

    const mutation = useFileUpload();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0] || null);
    };
    const nevigate = useNavigate();
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

        mutation.mutate(formData, {
            onSuccess: (data) => {
                toast({
                    title: "Upload Successful",
                    description: data.erpSystemResponse.message,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                },


                );
                nevigate("/db2/upload/uploadedFileList");
            },
            onError: (error) => {
                toast({
                    title: "Upload Failed",
                    description: error.message || "Something went wrong",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            },
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

                    {/* 🔥 Title */}
                    <Heading size="md">Upload Study Material</Heading>
                    <Text fontSize="sm" color="gray.500">
                        Select details and upload file for students
                    </Text>

                    <Divider />

                    {/* 📚 Academic Info */}
                    <FormControl>
                        <FormLabel>Board</FormLabel>
                        <Select placeholder="Select Board" onChange={(e) => setBoard(e.target.value)}>
                            <option value="cbse">CBSE</option>
                            <option value="icse">ICSE</option>
                            <option value="ssc">SSC</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Class</FormLabel>
                        <Select placeholder="Select Class" onChange={(e) => setStudentClass(e.target.value)}>
                            <option value="juniorKg">Junior KG</option>
                            <option value="seniorKg">Senior KG</option>
                            <option value="first">1st class</option>
                            <option value="second">2nd class</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Subject</FormLabel>
                        <Select placeholder="Select Subject" onChange={(e) => setSubject(e.target.value)}>
                            <option value="hindi">Hindi</option>
                            <option value="english">English</option>
                            <option value="marathi">Marathi</option>
                        </Select>
                    </FormControl>

                    {/* 🔹 Row Layout */}
                    <HStack spacing={4}>
                        <FormControl>
                            <FormLabel>Term</FormLabel>
                            <Select placeholder="Term" onChange={(e) => setTerm(e.target.value)}>
                                <option value="term1">Term 1</option>
                                <option value="term2">Term 2</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Chapter</FormLabel>
                            <Select placeholder="Chapter" onChange={(e) => setChapter(e.target.value)}>
                                <option value="chapter1">Chapter 1</option>
                                <option value="chapter2">Chapter 2</option>
                            </Select>
                        </FormControl>
                    </HStack>

                    <FormControl>
                        <FormLabel>Content Type</FormLabel>
                        <Select placeholder="Select Type" onChange={(e) => setType(e.target.value)}>
                            <option value="practiceWorksheet">Practice Worksheet</option>
                            <option value="modelPaper">Model Paper</option>
                            <option value="assignment">Assignment</option>
                        </Select>
                    </FormControl>

                    <Divider />

                    {/* 📁 File Upload */}
                    <FormControl>
                        <FormLabel>Upload File</FormLabel>
                        <Input type="file" onChange={handleFileChange} />
                    </FormControl>

                    {/* 🚀 Button */}
                    <Button
                        size="lg"
                        colorScheme="blue"
                        onClick={handleUpload}
                        isLoading={mutation.isPending}
                    >
                        Upload File
                    </Button>

                    {/* 🧾 Status */}
                    {mutation.isError && (
                        <Text color="red.500" fontSize="sm">
                            Error: {mutation.error.message}
                        </Text>
                    )}

                    {mutation.isSuccess && (
                        <Text color="green.500" fontSize="sm">
                            Upload successful!
                        </Text>
                    )}

                    {/* 🔗 Link */}
                    <Text
                        as="span"
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => nevigate("/db2/upload/uploadedFileList")}
                    >
                        View Uploaded Files →
                    </Text>

                </VStack>
            </Box>

            <Outlet />
        </>
    );

}

export default Publish