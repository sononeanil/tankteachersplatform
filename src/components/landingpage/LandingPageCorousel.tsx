import React from "react";
import Slider from "react-slick";
import { Box, Text } from "@chakra-ui/react";

const SimpleCarousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 8000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const slides = [
    "Welcome to TANK Teachers Platform - Empowering Educators, Inspiring Learners",
    "Become a teacher and start earning by sharing your knowledge.",
    "Reach students worldwide and teach globally 🌍",
    "Get AI-powered notes, summaries, and question papers instantly ⚡",
  ];

  return (
    <Box maxW="full" mx="auto" px={2} mb={5} boxShadow="xl">
      <Slider {...settings}>
        {slides.map((msg, i) => (
          <Box
            key={i}
            p={{ base: 6, md: 10 }}
            borderRadius="xl"
            bgGradient="linear(to-r, blue.400, teal.200)"

            mx={2}
          >
            <Text
              fontSize={{ base: "lg", md: "2xl" }}
              fontWeight="bold"
              lineHeight="1.6"
            >
              {msg}
            </Text>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SimpleCarousel;