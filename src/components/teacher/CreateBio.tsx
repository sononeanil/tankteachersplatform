import { defaultValuesTutorBiography, tutorBiographySchema, type TutorBiographyType } from "../../types/tutorBiographyTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, GridItem, Input, Select, SimpleGrid, Text, Textarea } from "@chakra-ui/react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useCreateTutorBiography } from "../../tanstack/tutorBigraphyTanstack"
import { convertToList } from "../../common/commonFunctions"

const CreateBio = () => {
    const { register, handleSubmit, reset, formState: { errors } }
        = useForm<TutorBiographyType>({
            resolver: zodResolver(tutorBiographySchema),
            defaultValues: defaultValuesTutorBiography
        })
    const { mutateAsync, isPending } = useCreateTutorBiography();
    const createTutorBiographyHandler: SubmitHandler<TutorBiographyType> = async (data) => {
        try {
            const payload = {
                ...data,
                fees: {
                    daily: data.dailyFees ? Number(data.dailyFees) : null,
                    weekly: data.weeklyFees ? Number(data.weeklyFees) : null,
                    monthly: data.monthlyFees ? Number(data.monthlyFees) : null,
                    quarterly: data.quarterlyFees ? Number(data.quarterlyFees) : null,
                    yearly: data.yearlyFees ? Number(data.yearlyFees) : null
                },

                coreExpertise: convertToList(data.coreExpertise),
                subjectList: convertToList(data.subjectList),
                standardList: convertToList(data.standardList),
                boardList: convertToList(data.boardList),
                languages: convertToList(data.languages),
                preferableTimings: convertToList(data.preferableTimings),
                weeklyAvailability: convertToList(data.weeklyAvailability),
                credentials: convertToList(data.credentials),
                qualifications: convertToList(data.qualifications)
            };

            // optional: remove raw fields if backend doesn't expect them
            delete payload.dailyFees;
            delete payload.weeklyFees;
            delete payload.monthlyFees;
            delete payload.quarterlyFees;
            delete payload.yearlyFees;

            await mutateAsync(payload);

            reset();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <Container maxW={"container.lg"}
                padding={10} boxShadow={"2xl"}
                borderRadius={10}>
                <form onSubmit={handleSubmit(createTutorBiographyHandler)} >
                    <SimpleGrid columns={2}
                        columnGap={3} rowGap={5} spacing={10} width={"full"}>
                        <Text fontSize="xl" fontWeight="bold">Basic Details</Text>
                        <GridItem colSpan={2}>
                            <FormControl isInvalid={!!errors.headline}>
                                <FormLabel>Headline of Tutor Profile </FormLabel>
                                <Input placeholder="Enter your headline" {...register("headline")} />
                                <FormErrorMessage>
                                    {errors.headline && errors.headline.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.firstName}>
                                <FormLabel>First Name </FormLabel>
                                <Input placeholder="Enter your first name" {...register("firstName")} />
                                <FormErrorMessage>
                                    {errors.firstName && errors.firstName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.lastName}>
                                <FormLabel>Last Name </FormLabel>
                                <Input placeholder="Enter your last name" {...register("lastName")} />
                                <FormErrorMessage>
                                    {errors.lastName && errors.lastName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.userId}>
                                <FormLabel>User ID </FormLabel>
                                <Input placeholder="Enter your user ID" {...register("userId")} />
                                <FormErrorMessage>
                                    {errors.userId && errors.userId.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.emailId}>
                                <FormLabel>emailId </FormLabel>
                                <Input placeholder="Enter your emailId" {...register("emailId")} />
                                <FormErrorMessage>
                                    {errors.emailId && errors.emailId.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.phoneNumber}>
                                <FormLabel>Phone Number without leading zero or country code</FormLabel>
                                <Input placeholder="Enter your phoneNumber" {...register("phoneNumber")} />
                                <FormErrorMessage>
                                    {errors.phoneNumber && errors.phoneNumber.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.standardList}>
                                <FormLabel>standardList </FormLabel>
                                <Input placeholder="Enter your standardList" {...register("standardList")} />
                                <FormErrorMessage>
                                    {errors.standardList && errors.standardList.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <FormControl isInvalid={!!errors.coreExpertise}>
                                <FormLabel>coreExpertise </FormLabel>
                                <Input placeholder="Enter your coreExpertise" {...register("coreExpertise")} />
                                <FormErrorMessage>
                                    {errors.coreExpertise && errors.coreExpertise.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <FormControl isInvalid={!!errors.subjectList}>
                                <FormLabel>subjectList </FormLabel>
                                <Input placeholder="Enter your subjectList" {...register("subjectList")} />
                                <FormErrorMessage>
                                    {errors.subjectList && errors.subjectList.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>



                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.preferableTimings}>
                                <FormLabel>preferableTimings </FormLabel>
                                <Input placeholder="Enter your preferableTimings" {...register("preferableTimings")} />
                                <FormErrorMessage>
                                    {errors.preferableTimings && errors.preferableTimings.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <Text fontSize="xl" fontWeight="bold">Teaching Details</Text>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.projectedNewBatch}>
                                <FormLabel>Projected New Batch</FormLabel>

                                <Input
                                    type="date"
                                    {...register("projectedNewBatch")}
                                />

                                <FormErrorMessage>
                                    {errors.projectedNewBatch?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.dailyFees}>
                                <FormLabel>Daily Fees </FormLabel>
                                <Input type="number" placeholder="Enter your Daily Fees" {...register("dailyFees", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.dailyFees && errors.dailyFees.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.weeklyFees}>
                                <FormLabel>Weekly Fees </FormLabel>
                                <Input type="number" placeholder="Enter your Weekly Fees" {...register("weeklyFees", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.weeklyFees && errors.weeklyFees.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.monthlyFees}>
                                <FormLabel>Monthly Fees </FormLabel>
                                <Input type="number" placeholder="Enter your Monthly Fees" {...register("monthlyFees", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.monthlyFees && errors.monthlyFees.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.quarterlyFees}>
                                <FormLabel>Quarterly Fees </FormLabel>
                                <Input type="number" placeholder="Enter your Quarterly Fees" {...register("quarterlyFees", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.quarterlyFees && errors.quarterlyFees.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.yearlyFees}>
                                <FormLabel>Yearly Fees </FormLabel>
                                <Input type="number" placeholder="Enter your Yearly Fees" {...register("yearlyFees", { valueAsNumber: true })} />
                                <FormErrorMessage>
                                    {errors.yearlyFees && errors.yearlyFees.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <FormControl isInvalid={!!errors.description}>
                                <FormLabel>Description</FormLabel>

                                <Textarea
                                    placeholder="Tell parents about your teaching style, experience, and what makes you unique..."
                                    rows={6}
                                    resize="vertical"
                                    {...register("description")}
                                />
                                <FormHelperText>
                                    Share your teaching experience, style, and how you help students. Make it engaging and informative! It will help parents understand your approach and connect with you better.
                                </FormHelperText>
                                <FormErrorMessage>
                                    {errors.description?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.credentials}>
                                <FormLabel>Credentials / Education / Certifications </FormLabel>
                                <Input placeholder="Enter your credentials" {...register("credentials")} />
                                <FormErrorMessage>
                                    {errors.credentials && errors.credentials.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.profilePhoto}>
                                <FormLabel>profilePhoto </FormLabel>
                                <Input placeholder="Enter your profilePhoto" {...register("profilePhoto")} />
                                <FormErrorMessage>
                                    {errors.profilePhoto && errors.profilePhoto.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.gender}>
                                <FormLabel>Gender</FormLabel>

                                <Select
                                    placeholder="Select gender"
                                    {...register("gender")}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </Select>

                                <FormErrorMessage>
                                    {errors.gender?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.city}>
                                <FormLabel>city </FormLabel>
                                <Input placeholder="Enter your city" {...register("city")} />
                                <FormErrorMessage>
                                    {errors.city && errors.city.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.state}>
                                <FormLabel>state </FormLabel>
                                <Input placeholder="Enter your state" {...register("state")} />
                                <FormErrorMessage>
                                    {errors.state && errors.state.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.languages}>
                                <FormLabel>languages </FormLabel>
                                <Input placeholder="Enter your languages" {...register("languages")} />
                                <FormErrorMessage>
                                    {errors.languages && errors.languages.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.weeklyAvailability}>
                                <FormLabel>weeklyAvailability </FormLabel>
                                <Input placeholder="Enter your weeklyAvailability" {...register("weeklyAvailability")} />
                                <FormErrorMessage>
                                    {errors.weeklyAvailability && errors.weeklyAvailability.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.trialClassAvailable}>
                                <FormLabel>Trial Class Available</FormLabel>

                                <Select
                                    placeholder="Select option"
                                    {...register("trialClassAvailable", {
                                        setValueAs: (value) => value === "true"
                                    })}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </Select>

                                <FormErrorMessage>
                                    {errors.trialClassAvailable?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.country}>
                                <FormLabel>country </FormLabel>
                                <Input placeholder="Enter your country" {...register("country")} />
                                <FormErrorMessage>
                                    {errors.country && errors.country.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.boardList}>
                                <FormLabel>boardList </FormLabel>
                                <Input placeholder="Enter your boardList" {...register("boardList")} />
                                <FormErrorMessage>
                                    {errors.boardList && errors.boardList.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.pincode}>
                                <FormLabel>pincode </FormLabel>
                                <Input placeholder="Enter your pincode" {...register("pincode")} />
                                <FormErrorMessage>
                                    {errors.pincode && errors.pincode.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.qualifications}>
                                <FormLabel>qualifications </FormLabel>
                                <Input placeholder="Enter your qualifications" {...register("qualifications")} />
                                <FormErrorMessage>
                                    {errors.qualifications && errors.qualifications.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!!errors.password}>
                                <FormLabel>Password </FormLabel>
                                <Input type="password" placeholder="Enter your password" {...register("password")} />
                                <FormErrorMessage>
                                    {errors.password && errors.password.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={2}>
                            <FormControl>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    isLoading={isPending}
                                >
                                    Submit
                                </Button>
                            </FormControl>
                        </GridItem>


                    </SimpleGrid>
                </form>

            </Container >
        </>
    )
}

export default CreateBio