import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router";
import { app } from "../../firebase";

export default function Redirect() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectToLogin = () => {
    if (
      !auth.currentUser &&
      !location.pathname.includes("login") &&
      !location.pathname.includes("register")
    ) {
      navigate("/login");
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (!user?.uid) return redirectToLogin();
    if (location.pathname.includes("login")) navigate("/");
  });

  return <></>;
}
