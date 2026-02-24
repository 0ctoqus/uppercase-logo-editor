import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/uppercase-logo-editor/",
  plugins: [react()],
});
