import { Input, InputGroup, InputLeftElement, Box, Spinner, VStack } from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';
const SearchNotes = () => {

    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false);


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
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
            </InputGroup>

            {loading && <Spinner mt={4} />}

            {/* <VStack mt={6} spacing={4}>
                {results.map((res, i) => (
                    <SearchResultCard key={i} data={res} />
                ))}
            </VStack> */}
        </Box>
    );
}

export default SearchNotes