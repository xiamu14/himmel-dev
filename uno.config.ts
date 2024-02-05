// uno.config.ts
import { defineConfig } from "unocss";
import presetUno from "@unocss/preset-uno";
export default defineConfig({
  // ...UnoCSS options
  content: {
    pipeline: {
      include: [
        // the default
        // include js/ts files
        "src/demo/**/*.ts",
      ],
      // exclude files
      // exclude: []
    },
  },
  presets: [presetUno()],
});
