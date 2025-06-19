import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Open Sans', sans-serif` },
        body: { value: `'Open Sans', sans-serif` },
      },
      fontSizes: {
        xs: { value: "0.8rem" },
        sm: { value: "0.9rem" },
        md: { value: "0.92rem" }, // Increased
        lg: { value: "1.125rem" }, // 18px
        xl: { value: "1.25rem" }, // 20px
        "2xl": { value: "1.5rem" }, // 24px
        "3xl": { value: "1.875rem" }, // 30px
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: "blue",
      fontSize: "md",
    },
  },
});
