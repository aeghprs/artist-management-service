import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import {  MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "./index.css";
import App from "./App.tsx";

import { THEME } from "constant/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider theme={THEME}>
        <Notifications position="top-right" />
        <App />
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
);
