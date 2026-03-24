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
    "You become a teacher and start earning by sharing your knowledge. We provide you with the tools and support to create and sell your courses online.",
    "We will make your presence global and you can reach to students across the world. You became international tutor with us",
    "Get Individual login for Student and Parent. Scholer ships for great taent",
  ];

  return (
    <Box maxW="full" mx="auto" p={1} mb={5}>
      <Slider {...settings}>
        {slides.map((msg, i) => (
          <Box key={i} bgGradient="linear(to-r, #80eff7, #a1c4fd, #f2c1c1)"
            p={5} borderRadius="md" textAlign="center">
            <Text fontSize="2xl" color="white" fontWeight="bold">
              {msg}
            </Text>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SimpleCarousel;
