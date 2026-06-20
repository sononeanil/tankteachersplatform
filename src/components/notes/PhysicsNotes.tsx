import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Essential for formula styles!
import {
    Box,
    Flex,
    Select,
    Text,
    Heading,
    VStack,
    HStack,
    Spinner,
    Skeleton,
    Stack,
    Icon,
    Button,
    useColorModeValue,
    Card,
    CardHeader,
    CardBody,
    UnorderedList,
    ListItem,
    Divider,
    Badge
} from "@chakra-ui/react";
import { FiBookOpen, FiLayers, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const PhysicsNotes = () => {
    const params = useParams<Record<string, string>>();
    const rawParam = params.type || params.id || "";
    const decodedType = useMemo(() => (rawParam ? decodeURIComponent(rawParam) : ""), [rawParam]);

    const [activeChapter, setActiveChapter] = useState<string>("");

    // Adaptive Visual Theming
    const sidebarBg = useColorModeValue("white", "gray.800");
    const activeChapterBg = useColorModeValue("blue.50", "blue.900");
    const activeChapterText = useColorModeValue("blue.700", "blue.200");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const dashboardBg = useColorModeValue("gray.50", "gray.900");

    // --- Query 1: Fetch Chapter List for Sidebar ---
    const {
        data: dropdownData,
        isLoading: dropdownLoading,
        isError: isDropdownError,
        refetch: refetchChapters,
    } = useQuery<any>({
        queryKey: ["chapters", decodedType],
        queryFn: async () => {
            if (!decodedType) throw new Error("Route parameter key is missing.");
            return getChapterList({ key: decodedType });
        },
        enabled: !!decodedType,
        staleTime: Infinity,
        retry: 1,
    });

    // Normalize and securely map chapters list array from response payload
    const chapters = useMemo<string[]>(() => {
        if (!dropdownData) return [];
        const target = dropdownData.data ? dropdownData.data : dropdownData;

        let rawList: any[] = [];
        const corePayload = target?.notes ? target.notes : target;
        const innerArray = Array.isArray(corePayload) ? corePayload : corePayload?.notes;

        if (Array.isArray(innerArray) && innerArray.length > 0) {
            rawList = innerArray.map(item => item?.chapter_title || item?.chapterName || item);
        } else if (target && (target.chapter_title || target.chapterName)) {
            rawList = [target.chapter_title || target.chapterName];
        } else if (target.lstChapters && Array.isArray(target.lstChapters)) {
            rawList = target.lstChapters;
        } else if (target.chapters && Array.isArray(target.chapters)) {
            rawList = target.chapters;
        }

        return Array.from(new Set(rawList.map(String).filter(Boolean)));
    }, [dropdownData]);

    // Handle initial selection smoothly
    useEffect(() => {
        if (chapters.length > 0 && !activeChapter) {
            setActiveChapter(chapters[0]);
        }
    }, [chapters, activeChapter]);

    // --- Query 2: Fetch Chapter Content Details ---
    const {
        data: contentResponse,
        isLoading: contentLoading,
        isError: isContentError,
        refetch: refetchContent,
    } = useQuery<any>({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType, chapter: activeChapter }),
        enabled: !!decodedType && !!activeChapter && activeChapter !== "",
        staleTime: 1000 * 60 * 20,
        retry: 1,
    });

    // Extract the raw notes array directly
    const masterNotesArray = useMemo(() => {
        if (!contentResponse) return [];
        const root = contentResponse.data ? contentResponse.data : contentResponse;
        const corePayload = root.notes ? root.notes : root;
        const targetObj = Array.isArray(corePayload) ? corePayload[0] : corePayload;

        return targetObj?.master_notes || [];
    }, [contentResponse]);

    const chapterSummary = useMemo(() => {
        if (!contentResponse) return "";
        const root = contentResponse.data ? contentResponse.data : contentResponse;
        return root.summary || root.notes?.summary || "";
    }, [contentResponse]);

    return (
        <Flex direction={{ base: "column", md: "row" }} minH="100vh" bg={dashboardBg}>

            {/* LEFT NAVIGATION COLUMN */}
            <Box
                w={{ base: "100%", md: "300px" }}
                bg={sidebarBg}
                borderRight={{ base: "none", md: "1px solid" }}
                borderBottom="1px solid"
                borderLeftColor={{ base: "none", md: borderColor }}
                borderColor={borderColor}
                p={5}
                position={{ md: "sticky" }}
                top="0"
                h={{ md: "100vh" }}
                zIndex="10"
            >
                <VStack align="stretch" spacing={5}>
                    <HStack spacing={3}>
                        <Icon as={FiBookOpen} boxSize={5} color="blue.500" />
                        <Heading size="sm" letterSpacing="wide" textTransform="uppercase" color="gray.500">
                            Course Chapters
                        </Heading>
                    </HStack>

                    {dropdownLoading ? (
                        <HStack justify="center" py={4}>
                            <Spinner size="sm" color="blue.500" />
                            <Text fontSize="sm" color="gray.500">Loading chapters...</Text>
                        </HStack>
                    ) : isDropdownError ? (
                        <VStack align="start" p={3} bg="red.50" borderRadius="lg" spacing={2}>
                            <HStack color="red.700" fontSize="xs" fontWeight="bold">
                                <Icon as={FiAlertCircle} />
                                <Text>Connection Refused</Text>
                            </HStack>
                            <Button
                                size="xs"
                                colorScheme="red"
                                variant="outline"
                                leftIcon={<FiRefreshCw />}
                                onClick={() => refetchChapters()}
                            >
                                Retry Index
                            </Button>
                        </VStack>
                    ) : (
                        <>
                            {/* Mobile Chapter Selector */}
                            <Box display={{ base: "block", md: "none" }}>
                                <Select
                                    value={activeChapter}
                                    onChange={(e) => setActiveChapter(e.target.value)}
                                    size="lg"
                                    bg={sidebarBg}
                                    fontWeight="semibold"
                                >
                                    {chapters.map((ch) => (
                                        <option key={ch} value={ch}>{ch}</option>
                                    ))}
                                </Select>
                            </Box>

                            {/* Desktop Sidebar Selector */}
                            <VStack display={{ base: "none", md: "flex" }} align="stretch" spacing={1} maxH="calc(100vh - 120px)" overflowY="auto">
                                {chapters.map((ch) => {
                                    const isSelected = activeChapter === ch;
                                    return (
                                        <HStack
                                            key={ch}
                                            p={3}
                                            cursor="pointer"
                                            borderRadius="lg"
                                            bg={isSelected ? activeChapterBg : "transparent"}
                                            color={isSelected ? activeChapterText : "gray.600"}
                                            _hover={{ bg: isSelected ? activeChapterBg : "gray.100" }}
                                            transition="all 0.2s"
                                            onClick={() => setActiveChapter(ch)}
                                        >
                                            <Icon as={FiLayers} color={isSelected ? "blue.500" : "gray.400"} />
                                            <Text fontWeight={isSelected ? "bold" : "medium"} fontSize="sm">
                                                {ch}
                                            </Text>
                                        </HStack>
                                    );
                                })}
                            </VStack>
                        </>
                    )}
                </VStack>
            </Box>

            {/* MAIN CONTENT DISPLAY VIEWPORT */}
            <Box flex="1" p={{ base: 4, md: 8 }} overflowY="auto">
                {contentLoading && activeChapter !== "" ? (
                    <VStack align="stretch" spacing={6}>
                        <Skeleton h="40px" w="40%" borderRadius="md" />
                        <Skeleton h="100px" w="100%" borderRadius="xl" />
                        <Skeleton h="200px" w="100%" borderRadius="xl" />
                    </VStack>
                ) : isContentError ? (
                    <Flex justify="center" align="center" minH="50vh" direction="column" p={6} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <Icon as={FiAlertCircle} boxSize={10} color="red.400" mb={3} />
                        <Heading size="sm" mb={1} color="gray.800">Connection Failed</Heading>
                        <Text color="gray.500" fontSize="sm" mb={4} textAlign="center" maxW="400px">
                            Could not load textbook content profiles for "{activeChapter}".
                        </Text>
                        <Button leftIcon={<FiRefreshCw />} colorScheme="blue" size="sm" onClick={() => refetchContent()}>
                            Retry Fetching Notes
                        </Button>
                    </Flex>
                ) : activeChapter ? (
                    <Box>
                        {/* Summary Header */}
                        <VStack align="start" spacing={3} mb={8}>
                            <Heading as="h1" size="xl" color="gray.800">
                                {activeChapter}
                            </Heading>
                            {chapterSummary && (
                                <Box bg="blue.50" p={5} borderRadius="xl" borderLeft="5px solid" borderColor="blue.500" mt={2} boxShadow="sm" w="100%">
                                    <Text fontSize="md" color="blue.900" lineHeight="relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                            {chapterSummary}
                                        </ReactMarkdown>
                                    </Text>
                                </Box>
                            )}
                        </VStack>

                        {/* Inline Core Notes Render */}
                        <VStack spacing={6} align="stretch">
                            {masterNotesArray.length === 0 ? (
                                <Text color="gray.400" fontStyle="italic">No revision notes available for this chapter.</Text>
                            ) : (
                                masterNotesArray.map((item: any, idx: number) => {
                                    const breakdown = item.section_breakdown || {};
                                    const bullets = breakdown.bullet_points || [];

                                    return (
                                        <Card key={idx} variant="outline" borderRadius="xl" boxShadow="sm">
                                            <CardHeader bg="gray.50" py={3} borderRadius="top-xl" borderBottom="1px solid" borderColor="gray.100">
                                                <Heading size="sm" color="gray.700">
                                                    {item.section_title}
                                                </Heading>
                                            </CardHeader>
                                            <CardBody>
                                                <VStack align="start" spacing={4} width="100%">
                                                    {breakdown.sectionOrTheme && (
                                                        <Badge colorScheme="blue" variant="subtle" px={2} py={0.5} borderRadius="md">
                                                            {breakdown.sectionOrTheme}
                                                        </Badge>
                                                    )}

                                                    {breakdown.explanation && (
                                                        <Box color="gray.600" fontSize="md" lineHeight="base" width="100%">
                                                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                                {breakdown.explanation}
                                                            </ReactMarkdown>
                                                        </Box>
                                                    )}

                                                    {bullets.length > 0 && (
                                                        <>
                                                            <Divider />
                                                            <UnorderedList spacing={2} pl={4} color="gray.700" fontSize="md" width="100%">
                                                                {bullets.map((bullet: string, bIdx: number) => (
                                                                    <ListItem key={bIdx}>
                                                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                                            {bullet}
                                                                        </ReactMarkdown>
                                                                    </ListItem>
                                                                ))}
                                                            </UnorderedList>
                                                        </>
                                                    )}
                                                </VStack>
                                            </CardBody>
                                        </Card>
                                    );
                                })
                            )}
                        </VStack>
                    </Box>
                ) : (
                    <Flex justify="center" align="center" minH="50vh" direction="column" p={6} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <Icon as={FiBookOpen} boxSize={10} color="blue.400" mb={3} />
                        <Heading size="sm" mb={1} color="gray.800">Start Your Study Session</Heading>
                        <Text color="gray.500" fontSize="sm" textAlign="center">
                            Select a chapter option from the index menu to display notes text sheets.
                        </Text>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default PhysicsNotes;