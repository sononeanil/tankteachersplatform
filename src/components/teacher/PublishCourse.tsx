import { useForm } from "react-hook-form";
import { courseSchema, type PublishCourseType } from "../../types/publishCourseTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Input,
    Select,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    useToast,
    Container,
    SimpleGrid,
    GridItem,
} from "@chakra-ui/react";
import { usePublishCourse } from "../../service/ApiPublishCourse";
// import { useState } from "react";


const PublishCourse = () => {
    const userInfoString = localStorage.getItem("loggedInUser");
    const loggedInUser = userInfoString ? JSON.parse(userInfoString) : null;
    // const [qrExists, setQrExists] = useState<boolean | null>(null);
    // const [qrFile, setQrFile] = useState<File | null>(null);
    const toast = useToast();

    const mutation = usePublishCourse();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<PublishCourseType>({
        resolver: zodResolver(courseSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "all",
    });

    const publishCourse = (data: PublishCourseType) => {
        const finalData = {
            ...data,
            id: 0, // 👈 add id here
            organizerEmailId: loggedInUser.email,
        };
        mutation.mutate(finalData, {
            onSuccess: () => {
                toast({
                    title: "Course published successfully!",
                    status: "success",
                    duration: null,
                    isClosable: true,
                    position: "top",
                });
                reset();
            }
        });
    };


    return (
        <>
            <Container
                maxW="container.lg"
                p={{ base: 4, md: 10 }}
                boxShadow="2xl"
                borderRadius="10px"
            >
                <Heading mb={6}>Publish Course 🚀</Heading>
                <form onSubmit={handleSubmit(publishCourse)} >
                    <SimpleGrid columns={{ base: 1, md: 2 }} columnGap={3} rowGap={5} spacing={10} width={"full"}>
                        <GridItem colSpan={{ base: 1, md: 2 }}>
                            <FormControl isInvalid={!!errors.courseName}>
                                <FormLabel>courseName </FormLabel>
                                <Input placeholder="Enter your courseName" {...register("courseName")} />
                                <FormErrorMessage>
                                    {errors.courseName && errors.courseName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.specificTopic}>
                                <FormLabel>specificTopic </FormLabel>
                                <Input placeholder="Enter your specificTopic" {...register("specificTopic")} />
                                <FormErrorMessage>
                                    {errors.specificTopic && errors.specificTopic.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.batchStartTime}>
                                <FormLabel>batchStartTime </FormLabel>
                                <Input type="datetime-local" placeholder="Enter your batchStartTime" {...register("batchStartTime")} />
                                <FormErrorMessage>
                                    {errors.batchStartTime && errors.batchStartTime.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.numberOfDays}>
                                <FormLabel>numberOfDays </FormLabel>
                                <Input type="number" placeholder="Enter your numberOfDays" {...register("numberOfDays", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.numberOfDays && errors.numberOfDays.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.numberOfHourse}>
                                <FormLabel>numberOfHourse </FormLabel>
                                <Input type="number" placeholder="Enter your numberOfHourse" {...register("numberOfHourse", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.numberOfHourse && errors.numberOfHourse.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={{ base: 1, md: 2 }}>
                            <FormControl isInvalid={!!errors.description}>
                                <FormLabel>description </FormLabel>
                                <Input placeholder="Enter your description" {...register("description")} />
                                <FormErrorMessage>
                                    {errors.description && errors.description.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={{ base: 1, md: 2 }}>
                            <FormControl isInvalid={!!errors.targatedAudience}>
                                <FormLabel>targatedAudience </FormLabel>
                                <Input placeholder="Enter your targatedAudience" {...register("targatedAudience")} />
                                <FormErrorMessage>
                                    {errors.targatedAudience && errors.targatedAudience.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.modeOfDelivery}>
                                <FormLabel>modeOfDelivery </FormLabel>
                                <Select {...register("modeOfDelivery")}>
                                    <option value="online">Select mode</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.modeOfDelivery && errors.modeOfDelivery.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.fee}>
                                <FormLabel>fee </FormLabel>
                                <Input type="number" placeholder="Enter your fee" {...register("fee", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.fee && errors.fee.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.prerequisite}>
                                <FormLabel>prerequisite </FormLabel>
                                <Input placeholder="Enter your prerequisite" {...register("prerequisite")} />
                                <FormErrorMessage>
                                    {errors.prerequisite && errors.prerequisite.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ base: 1, md: 2 }}>
                            <FormControl>
                                <Button type="submit" colorScheme="blue"
                                    isDisabled={!isValid}
                                    isLoading={mutation.isPending}>Submit</Button>
                            </FormControl>
                        </GridItem>


                    </SimpleGrid>
                </form>

            </Container >
        </>
    );
}

export default PublishCourse