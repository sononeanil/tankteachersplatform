import { useQuery } from "@tanstack/react-query";
import { getChapterList, getChapterNotes } from "../../service/ApiNotes";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import {
    VStack,
    Select,
    Text,
    Spinner,
    Box,
    Icon,
    Divider,
    Button,
    HStack,
} from "@chakra-ui/react";
import { useState, useMemo, useEffect } from "react";
import { FaBookOpen, FaPenSquare } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";

// --- Tailored Interfaces ---
interface VocabularyItem {
    word: string;
    meaning: string;
}

interface AnalysisPayload {
    note?: string;
    explanation?: string;
    answersTextbookQuestion?: string;
    literaryDevices?: string[];
    contextualVocabulary?: VocabularyItem[];
    criticalAnalysisTip?: string;
}

interface MCQItem {
    question: string;
    options: string[];
    answer: string;
}

interface ExtractQuestionItem {
    questionType: string;
    questionText: string;
    modelAnswer: string;
}

interface CBSEExtractItem {
    verbatimExcerpt: string;
    questions: ExtractQuestionItem[];
}

interface LongAnswerItem {
    questionPrompt: string;
    markingSchemeCoreValuePoints: string[];
    modelTopperAnswer: string;
}

interface TextbookSolutionItem {
    questionNumber: string;
    textbookQuestion: string;
    modelAnswer: string;
}

interface ChapterNode {
    nodeType: string;
    sectionOrTheme: string;
    analysis?: AnalysisPayload;
    quickCheckMCQs?: MCQItem[];
    cbseExtractBasedQuestions?: CBSEExtractItem[];
    cbseCompetencyLongAnswers?: LongAnswerItem[];
    fullTextbookSolutions?: TextbookSolutionItem[];
}

interface MainNotesGroup {
    notes: ChapterNode[];
    summary: string;
    questions?: MCQItem[];
    mindMap?: string | null;
    vennDiagram?: any | null;
}

interface CompleteApiResponse {
    notes?: MainNotesGroup;
    message?: string;
}

const EnglishNotes = () => {
    const [activeChapter, setActiveChapter] = useState<string>("");
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const decodedType = useMemo(() => (type ? decodeURIComponent(type) : ""), [type]);

    // --- Query 1: Fetch Chapter Dropdown List ---
    const { data: dropdownData, isLoading: dropdownLoading, isError: dropdownError } = useQuery<any>({
        queryKey: ["chapters", decodedType],
        queryFn: () => {
            if (!decodedType) throw new Error("Type parameter is missing.");
            return getChapterList({ key: decodedType });
        },
        enabled: decodedType.length > 0,
        staleTime: Infinity,
    });

    const chapters = useMemo<string[]>(() => {
        if (!dropdownData) return [];
        if (Array.isArray(dropdownData)) return dropdownData;
        if (dropdownData.lstChapters && Array.isArray(dropdownData.lstChapters)) return dropdownData.lstChapters;
        if (dropdownData.data?.lstChapters && Array.isArray(dropdownData.data.lstChapters)) return dropdownData.data.lstChapters;
        return [];
    }, [dropdownData]);

    useEffect(() => {
        if (chapters.length > 0 && !activeChapter) {
            setActiveChapter(chapters[0]);
        }
    }, [chapters, activeChapter]);

    // --- Query 2: Fetch Notes Payload ---
    const { data: contentResponse, isFetching: contentLoading } = useQuery<CompleteApiResponse>({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType, chapter: activeChapter }),
        enabled: decodedType.length > 0 && activeChapter.length > 0,
        staleTime: 1000 * 60 * 20,
    });

    // =========================================================================
    // 🛠️ DATA EXTRACTION LOGIC
    // =========================================================================

    const chapterData = useMemo<any>(() => {
        if (!contentResponse) return null;
        if ((contentResponse as any).data) {
            return (contentResponse as any).data;
        }
        return contentResponse;
    }, [contentResponse]);

    // Pass the raw underlying data object array un-filtered so children extract their own slices
    const themesList = useMemo(() => {
        const targetArray = Array.isArray(chapterData)
            ? chapterData
            : (chapterData && Array.isArray(chapterData.notes) ? chapterData.notes : null);

        if (!targetArray) return [];
        return targetArray;
    }, [chapterData]);

    const totalAggregatedMCQs = useMemo(() => {
        const targetArray = Array.isArray(chapterData)
            ? chapterData
            : (chapterData && Array.isArray(chapterData.notes) ? chapterData.notes : null);

        const list: MCQItem[] = [];
        if (Array.isArray(targetArray)) {
            targetArray.forEach(node => {
                if (node && Array.isArray(node.quickCheckMCQs)) {
                    list.push(...node.quickCheckMCQs);
                }
            });
        }
        if (chapterData && Array.isArray(chapterData.questions)) {
            list.push(...chapterData.questions);
        }
        return list;
    }, [chapterData]);

    // Dynamic pathing tracker helpers to check which route button highlight is active
    const isExerciseRouteActive = location.pathname.endsWith("/exercises") || location.pathname.includes("exercise");

    return (
        <VStack w="full" maxW="5xl" mx="auto" p={{ base: 4, md: 6 }} spacing={6} align="stretch">
            {/* Header */}
            <VStack spacing={1} textAlign="center">
                <Text
                    fontSize="3xl"
                    fontWeight="black"
                    bgGradient="linear(to-r, blue.500, purple.600, pink.500)"
                    bgClip="text"
                    letterSpacing="tight"
                >
                    📚 Advanced Smart-Learning Hub
                </Text>
                <Text color="gray.500" fontSize="sm">
                    CBSE Focused Explanations, Analytical Insights, & Textbook Solutions
                </Text>
            </VStack>

            {/* Selector dropdown */}
            <Box
                position="relative"
                borderRadius="2xl"
                p="2px"
                bgGradient="linear(to-r, cyan.400, blue.500, purple.600)"
                boxShadow="0px 12px 24px rgba(102, 126, 234, 0.15)"
            >
                <Select
                    placeholder="Choose a chapter module to start learning..."
                    value={activeChapter}
                    onChange={(e) => {
                        setActiveChapter(e.target.value);
                        setQuizAnswers({});
                        setSubmittedQuiz(false);
                    }}
                    disabled={dropdownLoading || !!dropdownError || chapters.length === 0}
                    bg="white"
                    border="none"
                    borderRadius="xl"
                    height="56px"
                    fontWeight="bold"
                    color="gray.700"
                    cursor="pointer"
                    icon={<Icon as={FaBookOpen} color="purple.500" w={5} h={5} />}
                >
                    {chapters.map((chapter) => (
                        <option key={chapter} value={chapter}>
                            ✨ {chapter}
                        </option>
                    ))}
                </Select>
            </Box>

            {/* Sub-Navigation Links Strip (Dynamic Toggling System) */}
            {activeChapter && (
                <HStack w="full" spacing={3} pt={1} justify={{ base: "stretch", md: "flex-start" }}>
                    <Button
                        leftIcon={<Icon as={FaPenSquare} />}
                        onClick={() => navigate("")} // Points back to default child path
                        variant={!isExerciseRouteActive ? "solid" : "outline"}
                        colorScheme="purple"
                        borderRadius="xl"
                        flex={{ base: 1, md: "initial" }}
                        size="md"
                        fontWeight="bold"
                    >
                        Narrative Analysis
                    </Button>

                    <Button
                        leftIcon={<Icon as={MdMenuBook} />}
                        onClick={() => navigate("textbookSolutions")} // Points directly to your exercise child layout route path
                        variant={isExerciseRouteActive ? "solid" : "outline"}
                        colorScheme="blue"
                        borderRadius="xl"
                        flex={{ base: 1, md: "initial" }}
                        size="md"
                        fontWeight="bold"
                    >
                        Textbook Solutions
                    </Button>
                </HStack>
            )}

            {/* Loading indicators */}
            {dropdownLoading && (
                <VStack py={4}>
                    <Spinner size="md" color="blue.500" />
                    <Text fontSize="xs" color="gray.500">Loading module indexes...</Text>
                </VStack>
            )}

            {contentLoading && (
                <VStack py={12}>
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text fontSize="sm" color="purple.600" fontWeight="bold">Syncing learning workspace objects...</Text>
                </VStack>
            )}

            <Divider />

            {/* Content Display */}
            <Outlet context={{ themesList, isLoading: contentLoading }} />
        </VStack>
    );
};

export default EnglishNotes;