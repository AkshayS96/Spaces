import { popoverAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle((props) => ({
    content: {
        boxShadow: "lg",
        width: 200,
        mr: 2
    },
    arrow: {
        ml: 1
    },
}));

export const popoverTheme = defineMultiStyleConfig({
    baseStyle,
});