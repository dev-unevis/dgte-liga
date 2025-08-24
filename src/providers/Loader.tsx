import { LinearProgress, useMediaQuery } from "@mui/material";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import theme from "../theme";

interface ILoaderContext {
  loading: boolean;
  setLoading: Dispatch<boolean>;
}

const LoaderContext = createContext<ILoaderContext | null>(null);

export const useLoader = () => useContext(LoaderContext) as ILoaderContext;

export const Loader = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className={`fixed! ${isMobile ? "bottom-0" : "top-0!"} w-full`}>
          <LinearProgress />
        </div>
      )}
    </LoaderContext.Provider>
  );
};
