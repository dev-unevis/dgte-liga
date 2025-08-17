import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Groups from "./pages/Groups.tsx";
import "./index.css";
import Layout from "./layout.tsx";
import Login from "./pages/Login.tsx";
import Players from "./pages/Players.tsx";
import Redirect from "./Redirect.tsx";
import theme from "./theme.ts";
import { Sidebar } from "./sidebar.tsx";

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
