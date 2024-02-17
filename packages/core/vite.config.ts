// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, "src/core/index.ts"),
        resolve(__dirname, "src/core/dom.ts"),
        resolve(__dirname, "src/core/signal.ts"),
      ],
      formats: ["es"],
      fileName(format, entryName) {
        return `${entryName}.${format}.js`;
      },
    },
  },
  plugins: [
    // UnoCSS(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  define: {
    __DEV__: true,
  },
});
