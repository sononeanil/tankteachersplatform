import { Box, Button, Input, Text, useToast, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { uploadFile } from "../../Api";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Upload = () => {
    const useFileUpload = () => {
        return useMutation({
            mutationFn: (formData: FormData) => uploadFile(formData),
        });
    };

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const toast = useToast();
    const mutation = useFileUpload();
    const navigate = useNavigate();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
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

        const formData = new FormData();
        formData.append("file", selectedFile);

        mutation.mutate(formData, {
            onSuccess: (data) => {
                toast({
                    title: "Upload Successful",
                    description: data?.erpSystemResponse?.message || "File uploaded successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate("/db2/upload/uploadedFileList");
            },
            onError: (error) => {
                toast({
                    title: "Upload Failed",
                    description:
                        error?.message ||

                        "Something went wrong",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            },
        });
    };

    return (
        <>
            <Box p={6} maxW="500px" mx="auto" borderWidth="1px" borderRadius="lg" shadow="md">
                <VStack spacing={4} align="stretch">
                    <Input type="file" onChange={handleFileChange} />
                    <Button
                        colorScheme="teal"
                        onClick={handleUpload}
                        isLoading={mutation.isPending}
                    >
                        Upload
                    </Button>
                    {mutation.isError && <Text color="red.500">Error: {mutation.error.message}</Text>}
                    {mutation.isSuccess && <Text color="green.500">Success!</Text>}
                </VStack>
                <Link to={"/db2/upload/uploadedFileList"}>uploadedFileList</Link>
            </Box>
            <Outlet />
        </>
    );
};

export default Upload;