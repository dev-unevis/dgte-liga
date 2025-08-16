import { useMediaQuery } from "@mui/material";
import theme from "./theme";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div
      style={{
        width: isMobile ? "100%" : "calc(100% - 240px)",
        marginLeft: isMobile ? "0" : "240px",
      }}
      className="flex justify-center items-center my-10"
    >
      {children}
    </div>
  );
}
