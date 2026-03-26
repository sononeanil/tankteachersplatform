import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
    },



    colors: {
        brand: {
            500: "#3182ce",
            600: "#2c5282",
        },
    },

    components: {
        Input: {
            variants: {
                outline: {
                    field: {
                        border: "2px solid",
                        borderColor: "blue.400",
                        borderRadius: "md",
                        px: 4,
                        py: 2,

                        boxShadow: "sm",

                        _hover: {
                            borderColor: "blue.400",
                            boxShadow: "md",
                        },

                        _focus: {
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182ce, 0 4px 10px rgba(0,0,0,0.1)",
                        },

                        _dark: {
                            bg: "gray.800",
                            borderColor: "gray.600",
                        },

                        transition: "all 0.2s ease-in-out",
                    },
                },
            },
            defaultProps: {
                variant: "outline",
            },
        },
        FormLabel: {
            baseStyle: {
                fontWeight: "semibold",
                fontSize: "sm",
                mb: 1,
                color: "gray.700",
                _dark: {
                    color: "gray.300",
                },
            },
        },
        FormError: {
            baseStyle: {
                text: {
                    fontSize: "sm",
                    color: "red.500",
                },
            },
        },
        Button: {
            baseStyle: {
                borderRadius: "md",
                fontWeight: "semibold",
            },
            variants: {
                solid: {
                    bg: "blue.500",
                    color: "white",

                    _hover: {
                        bg: "blue.600",
                    },

                    _active: {
                        bg: "blue.700",
                    },
                },
            },
            defaultProps: {
                variant: "solid",
            },
        },
        Select: {
            variants: {
                outline: {
                    field: {
                        border: "2px solid",
                        borderColor: "gray.400",
                        borderRadius: "md",
                        bg: "white",
                        boxShadow: "sm",

                        _hover: {
                            borderColor: "blue.400",
                            boxShadow: "md",
                        },

                        _focus: {
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182ce, 0 4px 10px rgba(0,0,0,0.1)",
                        },

                        _dark: {
                            bg: "gray.800",
                            borderColor: "gray.600",
                        },

                        transition: "all 0.2s ease-in-out",
                    },

                    // 👇 optional: style dropdown icon
                    icon: {
                        color: "gray.500",
                    },
                },
            },
            defaultProps: {
                variant: "outline",
            },
        },
    },
});

export default theme;