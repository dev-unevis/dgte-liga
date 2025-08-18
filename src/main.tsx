import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Groups from "./pages/Groups.tsx";
import "./index.css";
import Layout from "./layout/layout.tsx";
import Login from "./pages/Login.tsx";
import Players from "./pages/Players.tsx";
import theme from "./theme.ts";
import { Sidebar } from "./layout/sidebar.tsx";
import { WithAuth } from "./components/WithAuth.tsx";
import Redirect from "./layout/redirect.tsx";
import Register from "./pages/Register.tsx";
import Matches from "./pages/Matches.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WithAuth>
          <Sidebar />
        </WithAuth>
        <Layout>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="players" element={<Players />} />
            <Route path="groups" element={<Groups />} />
            <Route path="matches" element={<Matches />} />
          </Routes>
        </Layout>
        <Redirect />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
