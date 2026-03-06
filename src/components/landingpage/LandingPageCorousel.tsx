import React from "react";
import Slider from "react-slick";
import { Box, Text } from "@chakra-ui/react";

const SimpleCarousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const slides = [
    "Welcome to Anil Sonone's Student Portal",
    "Total Users: 1200",
    "Every week new paper Added. Parental Control. Anaytics based suggestion",
    "Get Individual login for Student and Parent. Scholer ships for great taent",
  ];

  return (
    <Box maxW="full" mx="auto" p={1} mb={5}>
      <Slider {...settings}>
        {slides.map((msg, i) => (
          <Box key={i} bg="linear-gradient(#80eff7ff, #f2c1c1ff)" p={10} borderRadius="md" textAlign="center">
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
