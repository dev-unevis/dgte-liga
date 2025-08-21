import { createTheme } from "@mui/material";
import { hrHR } from "@mui/x-date-pickers/locales";
import { hrHR as coreHrHR } from "@mui/material/locale";

export default createTheme(
  {
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    typography: {
      h4: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "16px",
            padding: "12px 24px",
          },
        },
      },
    },
  },
  hrHR,
  coreHrHR
);
