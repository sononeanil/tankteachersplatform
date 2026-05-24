import {
    Input, InputGroup, InputLeftElement,
    Box, Spinner
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';
import { useState } from 'react';
const SearchNotes = () => {

    const [query, setQuery] = useState("");
    // const [results, setResults] = useState<any[]>([]); // Typed as an array to prevent future 'never' errors
    const [loading, setLoading] = useState(false);


    const handleSearch = async () => {
        setLoading(true);
        // Call your backend API: /api/notes/search?q=query
        // const data = await fetchSearch(query); 
        // setResults(data);
        setLoading(false);
    };

    return (
        <Box w="100%" maxW="800px" mx="auto" mt={10}>
            <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                    <MdSearch color="gray.300" />
                </InputLeftElement>
                <Input
                    placeholder="Ask a question (e.g., 'What is meristematic tissue?')"
                    borderRadius="full"
                    value={query} // 2. Bounded the state value to the input field
                    // 3. Typed the change and key down events for absolute TS safety
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
                />
            </InputGroup>

            {loading && <Spinner mt={4} />}
        </Box>
    );
}

export default SearchNotes