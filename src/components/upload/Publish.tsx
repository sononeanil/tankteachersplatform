import { Box, Button, Input, Select, Text, useToast, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { uploadFile } from "../../Api"
import { Link, Outlet, useNavigate } from "react-router";

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
            <Box mt={10} p={6} maxW="500px" mx="auto" borderWidth="1px" borderRadius="lg" shadow="md">
                <Select onChange={(e) => setBoard(e.target.value)} name="board" id="board" placeholder="Select Board">
                    <option value="cbse">CBSE</option>
                    <option value="icse">ICSE</option>
                    <option value="ssc">SSC</option>
                </Select>
                <Select onChange={(e) => setStudentClass(e.target.value)}
                    name="class" id="class" placeholder="Select Class">
                    <option value="juniorKg">Junior KG</option>
                    <option value="seniorKg">Senior KG</option>
                    <option value="first">1st class</option>
                    <option value="second">2nd class</option>
                    <option value="third">3rd class</option>
                </Select>
                <Select
                    onChange={(e) => setSubject(e.target.value)}
                    name="subject" id="subject" placeholder="Select Subject">
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="marathi">Marathi</option>
                </Select>

                <Select
                    onChange={(e) => setTerm(e.target.value)}
                    name="term" id="term" placeholder="Select term">
                    <option value="term1">Term 1</option>
                    <option value="term2">Term 2</option>
                </Select>

                <Select
                    onChange={(e) => setChapter(e.target.value)}
                    name="chapter" id="chapter" placeholder="Select Chapter">
                    <option value="chapter1">Chapter 1</option>
                    <option value="chapter2">Chapter 2</option>
                    <option value="chapter3">Chapter 3</option>
                </Select>
                <Select
                    onChange={(e) => setType(e.target.value)}
                    name="type" id="type" placeholder="Select type">
                    <option value="practiceWorksheet">Practice Worksheet</option>
                    <option value="modelPaper">modelPaper</option>
                    <option value="assignment">Assignment</option>
                </Select>

                <VStack spacing={4} align="stretch">

                    <Input type="file" onChange={handleFileChange} />
                    <Button colorScheme="teal" onClick={handleUpload} isLoading={mutation.isPending}>
                        Upload
                    </Button>
                    {mutation.isError && <Text color="red.500">Error: {mutation.error.message}</Text>}
                    {mutation.isSuccess && <Text color="green.500">Success!</Text>}
                </VStack>
                <Link to={"/db2/upload/uploadedFileList"}>uploadedFileList</Link>
            </Box>

            <Outlet>

            </Outlet>
        </>
    )

}

export default Publish