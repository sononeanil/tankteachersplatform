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
import { useState } from "react";
import { uploadChapter, uploadPDFChapter } from "../../service/ApiUpload";
import { useNotes } from "../../tanstack/uploadTanstack";
import { getLoggedinUserEmailId } from "../../service/ApiClient";
const NewNotes = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [studentClass, setStudentClass] = useState("");
    const [board, setBoard] = useState("");
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");

    const toast = useToast();

    const uploadMutation = useMutation({
        mutationFn: ({ formData, isPDF }: { formData: FormData; isPDF: boolean }) =>
            isPDF ? uploadPDFChapter(formData) : uploadChapter(formData),
    });

    // ✅ Hook (API logic separated)
    const { isLoadingNotes } = useNotes();

    // ✅ File select
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

        const destinationDirectory = `${board}/${studentClass}/${subject}`;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("subject", destinationDirectory);
        formData.append("chapterName", chapter);
        formData.append("createdBy", getLoggedinUserEmailId() || "unknown");

        const isPDF =
            selectedFile.type === "application/pdf" ||
            selectedFile.name.toLowerCase().endsWith(".pdf");

        uploadMutation.mutate(
            { formData, isPDF },
            {
                onSuccess: (data: any) => {
                    toast({
                        title: "Upload Successful",
                        description:
                            data?.erpSystemResponse?.message || "File uploaded",
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
            }
        );
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
                    <Heading size="md">Upload PDF to generate Study Material</Heading>

                    <Text fontSize="sm" color="gray.500">
                        Selecting all details are mandatory
                    </Text>

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
                            <FormLabel>Chapter Number</FormLabel>
                            <Input placeholder="Enter Chapter Number"
                                value={chapter}
                                onChange={(e) => setChapter(e.target.value)} />
                        </FormControl>
                    </HStack>

                    <Divider borderColor="blue.400" />

                    <FormControl>
                        <FormLabel>Upload ONLY pdf File</FormLabel>
                        <Input type="file" onChange={handleFileChange} />
                    </FormControl>

                    {/* ✅ Get Notes */}
                    <Button

                        onClick={handleUpload}
                        isLoading={isLoadingNotes}
                        colorScheme="blue"
                    >
                        Get Notes
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

                </VStack>
            </Box>
        </>
    )
}

export default NewNotes