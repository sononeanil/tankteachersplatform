import { Box, Button, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react/color-mode';
import { useQuery } from '@tanstack/react-query';
import { getCustomerList } from '../../Api';

const ChakraUi2 = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isLoading, isError, data } = useQuery({
        queryKey: ["getCustomerList"],
        queryFn: () => getCustomerList()
    })

    if (isLoading) {
        return <Spinner size={'xl'}></Spinner>
    }

    if (isError) {
        <Text color="red.500">Error while loading data</Text>
    }

    return (
        <div>ChakraUi2
            {
                data?.map(element => (element.id))
            }

            <Button onClick={toggleColorMode}>
                Switch to {colorMode === "light" ? "Dark" : "Light"} Mode
            </Button>

            <Box p={4}>
                <Table variant="striped" colorScheme="teal">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Location</Th>
                            <Th>Budget</Th>
                            <Th>Specification</Th>
                            <Th>Phone Number</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.map((customerEntity) => (
                            <Tr key={customerEntity.id}>
                                <Td>{customerEntity.id}</Td>
                                <Td>{customerEntity.name}</Td>
                                <Td>{customerEntity.location}</Td>
                                <Td>{customerEntity.budget}</Td>
                                <Td>{customerEntity.specification}</Td>
                                <Td>{customerEntity.phonenumber}</Td>
                            </Tr>
                        ))}
                    </Tbody>

                </Table>
            </Box>

        </div>
    );
}

export default ChakraUi2