import { Box } from '@chakra-ui/react';

interface HighlightProps {
    text: string;
    searchQuery: string;
}

const HighlightText = ({ text, searchQuery }: HighlightProps) => {
    if (!text) return null;
    if (!searchQuery || !searchQuery.trim()) return <>{text}</>;

    // 1. Clean and split the user's query into individual keywords
    const fillerWords = new Set(['what', 'is', 'the', 'a', 'an', 'and', 'of', 'in', 'to', 'for', 'from', 'by', 'with', 'chapter', 'notes', 'define']);
    const keywords = searchQuery
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "") // remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 1 && !fillerWords.has(word));

    if (keywords.length === 0) return <>{text}</>;

    // 2. Create a regex pattern that matches ANY of the core keywords
    // e.g., (photosynthesis|definition|chlorophyll)
    const escapedKeywords = keywords.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regexPattern = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');

    const parts = text.split(regexPattern);

    return (
        <>
            {parts.map((part, index) => {
                const isMatch = keywords.includes(part.toLowerCase());
                return isMatch ? (
                    <Box
                        key={index}
                        as="mark"
                        bg="yellow.100"
                        color="orange.900"
                        px="3px"
                        py="1px"
                        borderRadius="sm"
                        fontWeight="semibold"
                        borderBottom="1px solid"
                        borderColor="orange.300"
                    >
                        {part}
                    </Box>
                ) : (
                    part
                );
            })}
        </>
    );
};
export default HighlightText;