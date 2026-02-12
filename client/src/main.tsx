import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";

import "./index.css";
import App from "./App.tsx";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  colors: {
    primary: [
      "#e3f2fd",
      "#bbdefb",
      "#90caf9",
      "#64b5f6",
      "#42a5f5",
      "#2196f3",
      "#1e88e5",
      "#1976d2",
      "#1565c0",
      "#0d47a1",
    ],
    secondary: [
      "#f3e5f5",
      "#e1bee7",
      "#ce93d8",
      "#ba68c8",
      "#ab47bc",
      "#9c27b0",
      "#8e24aa",
      "#7b1fa2",
      "#6a1b9a",
      "#4a148c",
    ],
    danger: [
      "#ffebee",
      "#ffcdd2",
      "#ef9a9a",
      "#e57373",
      "#ef5350",
      "#f44336",
      "#e53935",
      "#d32f2f",
      "#c62828",
      "#b71c1c",
    ],
  },
  primaryColor: "primary",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </StrictMode>,
);
