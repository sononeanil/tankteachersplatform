import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    GridItem,
    Input,
    Select,
    SimpleGrid,
    useToast
} from "@chakra-ui/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateZoom } from "../../tanstack/zoomTanstack";
import { createZoomMeeting } from "../../types/zoom"
import type { CreateZoomMeetingType } from "../../types/zoom"
import { useForm, type SubmitHandler } from "react-hook-form"
import { getLoggedinUserEmailId } from "../../service/ApiClient";
const CreateZoom = () => {
    const userEmailId = getLoggedinUserEmailId();

    const toast = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CreateZoomMeetingType>({
        resolver: zodResolver(createZoomMeeting)
    });

    const { mutateAsync } = useCreateZoom();

    const generatePassword = () => {
        const pass = Math.random().toString(36).substring(2, 8);
        setValue("password", pass);
    };

    const createZoom: SubmitHandler<CreateZoomMeetingType> = async (data) => {

        const formattedTime = data.startTime + ":00";

        const payload = {
            ...data,
            organizerEmail: userEmailId ?? undefined,
            startTime: formattedTime
        };

        try {

            await mutateAsync(payload);

            toast({
                title: "Meeting Scheduled 🎉",
                description: "Zoom meeting created successfully",
                status: "success",
                duration: 4000,
                isClosable: true
            });

        } catch (error) {

            toast({
                title: "Error",
                description: "Unable to create meeting",
                status: "error",
                duration: 4000
            });

        }
    };

    return (
        <Container maxW="container.lg" p={10} boxShadow="2xl" borderRadius={10}>

            <form onSubmit={handleSubmit(createZoom)}>

                <SimpleGrid columns={2} spacing={6}>

                    <GridItem colSpan={2}>
                        <FormControl isInvalid={!!errors.meetingTopic}>
                            <FormLabel>Meeting Topic</FormLabel>
                            <Input {...register("meetingTopic")} />
                            <FormErrorMessage>
                                {errors.meetingTopic?.message}
                            </FormErrorMessage>
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <FormControl isInvalid={!!errors.startTime}>
                            <FormLabel>Start Time</FormLabel>
                            <Input
                                type="datetime-local"
                                {...register("startTime")}
                            />
                            <FormErrorMessage>
                                {errors.startTime?.message}
                            </FormErrorMessage>
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <FormControl isInvalid={!!errors.duration}>
                            <FormLabel>Duration</FormLabel>
                            <Select {...register("duration")}>
                                <option value="">Select duration</option>
                                <option value="30">30 Minutes</option>
                                <option value="45">45 Minutes</option>
                                <option value="60">1 Hour</option>
                                <option value="90">1.5 Hours</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.duration?.message}
                            </FormErrorMessage>
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel>Password</FormLabel>

                            <SimpleGrid columns={2} spacing={3}>
                                <Input {...register("password")} />
                                <Button onClick={generatePassword}>
                                    Generate
                                </Button>
                            </SimpleGrid>

                            <FormErrorMessage>
                                {errors.password?.message}
                            </FormErrorMessage>
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="full"
                            isLoading={isSubmitting}
                        >
                            Schedule Meeting
                        </Button>
                    </GridItem>

                </SimpleGrid>

            </form>

        </Container>
    );
};

export default CreateZoom;