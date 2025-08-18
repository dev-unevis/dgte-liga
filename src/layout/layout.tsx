import { useMediaQuery } from "@mui/material";
import theme from "../theme";
import type { ReactNode } from "react";
import { useLocation } from "react-router";

export default function Layout({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const isAuthPage = location.pathname.includes("login") || location.pathname.includes("register");

  return (
    <div
      style={{
        width: isMobile || isAuthPage ? "100%" : "calc(100% - 240px)",
        marginLeft: isMobile || isAuthPage ? "0" : "240px",
      }}
      className="flex justify-center items-center my-10"
    >
      {children}
    </div>
  );
}
