import { Button } from "@chakra-ui/react";
import { useReactFlow } from 'reactflow';
const FlowChartControlPanel = () => {
    const { fitView } = useReactFlow();
    return (
        <Button
            position="absolute"
            bottom="20px"
            left="20px"
            zIndex={10} // Ensure it stays above the lines
            size="sm"
            colorScheme="blue"
            boxShadow="lg"
            onClick={() => fitView({ duration: 800 })} // Smooth transition
        >
            Center View 🎯
        </Button>
    );
}

export default FlowChartControlPanel