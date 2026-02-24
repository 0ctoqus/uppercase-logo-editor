import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LogoEditor from "./uc-editor-v3";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LogoEditor />
  </StrictMode>
);
