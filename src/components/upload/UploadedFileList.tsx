import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Select, VStack } from "@chakra-ui/react";
import { useGetAllUploadedFilesList, usePublishUpload } from "../../tanstack/tanstack"
import { zodResolver } from "@hookform/resolvers/zod";
import { publishUpload, type PublishUploadType } from "../../types/userType";
import { useForm, type SubmitHandler } from "react-hook-form";

const UploadedFileList = () => {
    // Call the hook directly
    const publishUploadMutation = usePublishUpload()

    const pulishUpload: SubmitHandler<PublishUploadType> = (data) => {
        const newpublish: PublishUploadType = {
            id: 0,
            type: data.type,
            term: data.term,
        }
        console.log("newpublish", newpublish)

        // Use mutate with the new data
        publishUploadMutation.mutate(newpublish)
    }

    const { register, handleSubmit, formState: { errors } } =
        useForm<PublishUploadType>({ resolver: zodResolver(publishUpload) })

    const { data } = useGetAllUploadedFilesList()

    return (
        <Container mt={10} maxW="container.lg" p={10} boxShadow="2xl" border="1px solid #afd5eeff" borderRadius={10}>
            <VStack spacing={6} align="stretch">
                {data?.map((file, index) => (
                    <Box
                        key={index}
                        p={6}
                        borderWidth="1px"
                        borderRadius="lg"
                        shadow="md"
                        bg="blue.50"
                        _hover={{ bg: "blue.100", transform: "scale(1.02)" }}
                        transition="all 0.2s"
                    >
                        <form onSubmit={handleSubmit(pulishUpload)}>
                            <FormControl mb={4} isInvalid={!!errors.term}>
                                <FormLabel htmlFor="term">{file}</FormLabel>
                                <FormLabel htmlFor="term">Semester</FormLabel>
                                <Select id="term" {...register("term")} placeholder="Please select semester">
                                    <option value="firstTerm">First Term</option>
                                    <option value="secondTerm">Second Term</option>
                                </Select>
                                <FormErrorMessage>{errors.term?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="type">Type</FormLabel>
                                <Select id="type" {...register("type")} placeholder="Please select Type">
                                    <option value="practiceWorksheet">Practice Worksheet</option>
                                    <option value="revisionWorksheet">Revision Worksheet</option>
                                    <option value="modelPaper">Model Paper</option>
                                </Select>
                            </FormControl>

                            <Button colorScheme="blue" type="submit">
                                Publish File
                            </Button>
                        </form>
                    </Box>
                ))}
            </VStack>
        </Container>
    )
}

export default UploadedFileList