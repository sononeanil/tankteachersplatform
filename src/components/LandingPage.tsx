import { GridItem, Heading, Card, CardHeader, CardBody, Stack, Grid, Box } from "@chakra-ui/react"

import { AreaChart, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts"

const COLORS = ["#3182CE", "#e67904ff", "#2C5282", "#1425e7ff"];


const dataAreaChart = [
    { month: "Jan", value: 400 },
    { month: "Feb", value: 300 },
    { month: "Mar", value: 500 },
    { month: "Apr", value: 200 },
    { month: "May", value: 600 },
    { month: "Jun", value: 700 },
    { month: "Jul", value: 500 },
    { month: "Aug", value: 400 },
    { month: "Sep", value: 600 },
];

const dataBarChart = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 300 },
    { month: "Mar", sales: 500 },
    { month: "Apr", sales: 200 },
    { month: "May", sales: 600 },
    { month: "Jun", sales: 700 },
    { month: "Jul", sales: 500 },
    { month: "Aug", sales: 400 },
    { month: "Sep", sales: 600 },
];

const dataDonutChart = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Groceries", value: 300 },
    { name: "Books", value: 200 },
];

const dataLineChart1 = [
    { value: 10 },
    { value: 30 },
    { value: 20 },
    { value: 40 },
    { value: 35 },
    { value: 50 },
    { value: 45 },
];

const dataBarChart1 = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Groceries", value: 250 },
    { name: "Books", value: 200 },
];

const LandingPage = () => {
    return (
        <>

            <Stack bg={"gray.50"}
                px={5}
                py={5}
                gap={10}>

                <Grid templateColumns="repeat(4, 1fr)"
                    templateRows="repeat(2, 1fr)"
                    gap={6}>


                    <GridItem >

                        <Card
                            size="md"
                            overflow="hidden"
                            boxShadow="2xl"
                            borderRadius="md"
                            variant="elevated"
                            maxW={"sm"}
                        >
                            <CardHeader>
                                <Heading size="md">Trend Overview</Heading>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width={80} height={80}>
                                    <LineChart data={dataLineChart1}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3182CE"
                                            strokeWidth={2}
                                            dot={false}   // 👈 removes dots for clean sparkline
                                        />
                                        <Tooltip />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>

                    </GridItem>
                    <GridItem rowStart={2}>

                        <Card
                            size="md"
                            overflow="hidden"
                            boxShadow="2xl"
                            borderRadius="md"
                            variant="elevated"
                            maxW={"sm"}
                        >
                            <CardHeader>
                                <Heading size="md">Trend Overview</Heading>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width={80} height={80}>
                                    <LineChart data={dataLineChart1}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#61062cff"
                                            strokeWidth={2}
                                            dot={false}   // 👈 removes dots for clean sparkline
                                        />
                                        <Tooltip />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem colSpan={3} rowSpan={2}>
                        <Card
                            size="lg"
                            overflow={"hidden"}
                            boxShadow="2xl"
                            borderRadius="md"
                            variant={"elevated"}>
                            <CardHeader>
                                <Heading size="md">Monthly Performance</Heading>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={dataAreaChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3182CE"
                                            fill="#90CDF4"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>


                <Grid templateColumns="repeat(4, 1fr)"
                    gap={6}>
                    <GridItem >
                        <Card
                            size="lg"
                            overflow="hidden"
                            boxShadow="2xl"
                            borderRadius="md"
                            variant="elevated"
                        >
                            <CardHeader>
                                <Heading size="md">Sales Distribution</Heading>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>

                                        <Pie
                                            data={dataDonutChart}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {dataDonutChart.map((entry, idx) => (
                                                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} name={entry.name} />

                                            ))}
                                        </Pie>

                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />

                                    </PieChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem colSpan={3}>
                        <Card
                            size="lg"
                            overflow="hidden"
                            boxShadow="2xl"
                            borderRadius="md"
                            variant="elevated"
                        >
                            <CardHeader>
                                <Heading size="md">Monthly Sales</Heading>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={dataBarChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="sales" fill="#3182CE" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)"
                    gap={6}>
                    <GridItem>
                        <Card
                            size="lg"
                            overflow="hidden"
                            boxShadow="2xl"
                            borderRadius="md"
                            variant="elevated"
                        >
                            <CardHeader>
                                <Heading size="md">Top Categories</Heading>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart
                                        layout="vertical"   // 👈 makes it a bar list (horizontal bars)
                                        data={dataBarChart1}
                                        margin={{ left: 40 }}
                                    >
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="name" />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#3182CE" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem>
                        <Card
                            size="lg"
                            overflow="hidden"
                            boxShadow="2xl"
                            borderRadius="md"
                            variant="elevated"
                        >
                            <CardHeader>
                                <Heading size="md">Top Categories</Heading>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart
                                        layout="vertical"   // 👈 makes it a bar list (horizontal bars)
                                        data={dataBarChart1}
                                        margin={{ left: 40 }}
                                    >
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="name" />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#9be40bff" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>

            </Stack>

            <Box>











            </Box>




        </>

    )
}

export default LandingPage