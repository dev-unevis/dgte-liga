import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useLocation, useNavigate } from "react-router";

export default function Redirect() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();

  if (!auth.currentUser && !location.pathname.includes("login")) {
    navigate("/login");
  }

  return <></>;
}
