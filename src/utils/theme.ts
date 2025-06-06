import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Open Sans', sans-serif` },
        body: { value: `'Open Sans', sans-serif` },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: "blue",
    },
  },
});
