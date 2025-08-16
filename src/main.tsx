import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Groups from "./Groups.tsx";
import "./index.css";
import Layout from "./layout.tsx";
import Login from "./Login.tsx";
import Players from "./Players.tsx";
import Redirect from "./Redirect.tsx";
import { Sidebar } from "./Sidebar.tsx";
import theme from "./theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Sidebar />
        <Layout>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="players" element={<Players />} />
            <Route path="groups" element={<Groups />} />
          </Routes>
        </Layout>
        <Redirect />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
