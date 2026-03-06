import { Box, Td, Text, TableContainer, Badge } from "@chakra-ui/react"
import { Table } from "@chakra-ui/react"
import {

    Thead,
    Tbody,
    Tr,
    Th,
} from "@chakra-ui/react";

const DataTable = () => {
    return (
        <Box gap={5} >
            <Text fontSize={"xl"}>data table</Text>





            <TableContainer gap={"5px"}
                mt={"5"} border={"1px solid red"}
                borderWidth="1px" rounded="md"
                height="160px"
                overflowY="auto"
                mb={10}


            >
                <Table size={"sm"}>

                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th isNumeric>Score</Th>
                            <Th isNumeric>Score1</Th>
                            <Th isNumeric>Score2</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Anil</Td>
                            <Badge colorScheme="green">Active</Badge>

                            <Td isNumeric>95</Td>
                            <Td isNumeric>95</Td>
                        </Tr>
                        <Tr>
                            <Td>Riya</Td>
                            <Td isNumeric>88</Td>
                        </Tr>
                        <Tr>
                            <Td>Sam</Td>
                            <Td isNumeric>76</Td>
                        </Tr>
                        <Tr>
                            <Td>Sam</Td>
                            <Td isNumeric>76</Td>
                        </Tr>
                        <Tr>
                            <Td>Sam</Td>
                            <Td isNumeric>76</Td>
                        </Tr>
                        <Tr>
                            <Td>Sam4</Td>
                            <Td isNumeric>76</Td>
                        </Tr>
                        <Tr>
                            <Td>Sam3</Td>
                            <Td isNumeric>76</Td>
                        </Tr>
                        <Tr>
                            <Td>Sam2</Td>
                            <Td isNumeric>76</Td>
                        </Tr>
                        <Tr>
                            <Td>Sam1</Td>
                            <Td isNumeric>76</Td>
                        </Tr>

                    </Tbody>

                </Table>


            </TableContainer>


            <Table size="sm" variant="outline" borderWidth="1px" rounded="md">
                <Thead>
                    <Tr>
                        <Th>Product</Th>
                        <Th>Category</Th>
                        <Th>Price</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>1</Td>
                        <Td>1</Td>
                        <Td>1</Td>
                    </Tr>
                    <Tr>
                        <Td>2</Td>
                        <Td>2</Td>
                        <Td>2</Td>
                    </Tr>
                    <Tr>
                        <Td>3</Td>
                        <Td>3</Td>
                        <Td>3</Td>
                    </Tr>
                    <Tr>
                        <Td>3</Td>
                        <Td>3</Td>
                        <Td>3</Td>
                    </Tr>
                    <Tr>
                        <Td>3</Td>
                        <Td>3</Td>
                        <Td>3</Td>
                    </Tr>
                    <Tr>
                        <Td>3</Td>
                        <Td>3</Td>
                        <Td>3</Td>
                    </Tr>
                    <Tr>
                        <Td>3</Td>
                        <Td>3</Td>
                        <Td>3</Td>
                    </Tr>
                    <Tr>
                        <Td>3</Td>
                        <Td>3</Td>
                        <Td>3</Td>
                    </Tr>

                </Tbody>
            </Table>

        </Box >

    )
}

export default DataTable