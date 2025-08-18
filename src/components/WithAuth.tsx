import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, type ReactNode } from "react";
import { app } from "../../firebase";

export const WithAuth = ({ children }: { children: ReactNode }) => {
  const auth = getAuth(app);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  onAuthStateChanged(auth, (user) => {
    setIsAuthenticated(!!user?.uid);
  });

  return isAuthenticated ? children : null;
};
