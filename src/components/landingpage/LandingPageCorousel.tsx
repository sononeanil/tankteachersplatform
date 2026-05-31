import React from "react";
import Slider from "react-slick";
import { Box, Text, Flex } from "@chakra-ui/react";

// Custom arrow components for slick-carousel using Chakra styling
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "block",
        background: "rgba(0,0,0,0.2)",
        borderRadius: "50%",
        right: "15px",
        zIndex: 2,
      }}
      _hover={{ background: "rgba(0,0,0,0.4)" }}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "block",
        background: "rgba(0,0,0,0.2)",
        borderRadius: "50%",
        left: "15px",
        zIndex: 2,
      }}
      _hover={{ background: "rgba(0,0,0,0.4)" }}
    />
  );
};

const LandingPageCorousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const slides = [
    "Welcome to TANK Student Platform - purely dedicated to CBSE notes for classes 6 to 12.",
    "Treeview, flowchart, mindmap, venn diagram and mcq for better understanding and revision 🧠",
    "Available even on mobile - access your notes anytime, anywhere 📱",
    "Get AI-powered notes, summaries, and question papers instantly ⚡",
  ];

  // Gradients matching the playful, educational vibe of your main page data
  const gradients = [
    "linear-gradient(135deg, #0c98f0ff, #b00ccdff)",
    "linear-gradient(135deg, #b00ccdff, #ee7dcaff)",
    "linear-gradient(135deg, #37e80fff, #0c98f0ff)",
    "linear-gradient(135deg, #ee7dcaff, #0c98f0ff)",
  ];

  return (
    <Box
      width="100%"
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      my={4}
    >
      <Slider {...settings}>
        {slides.map((text, index) => (
          <Box key={index}>
            <Flex
              direction="column"
              justify="center"
              align="center"
              bgGradient={gradients[index % gradients.length]}
              height={{ base: "120px", md: "160px" }} // Significantly reduced height
              color="white"
              px={{ base: 10, md: 16 }} // Side padding padded so text doesn't hit arrows
              textAlign="center"
            >
              <Text
                fontSize={{ base: "md", md: "xl" }}
                fontWeight="semibold"
                maxW="800px"
                lineHeight="short"
              >
                {text}
              </Text>
            </Flex>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default LandingPageCorousel;