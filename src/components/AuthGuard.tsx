import { useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import { IAuthState } from "../redux/reducers/authReducer";
import { RootState } from "../redux/reducers/rootReducer";

interface Props {
  children: any;
}

// For routes that can only be accessed by authenticated users
const AuthGuard: React.FC<Props> = ({ children }) => {
  const auth = useSelector<RootState, IAuthState>((state) => state.authReducer);
  const location = useLocation();

  localStorage.setItem("lastPath", location.pathname);
  if (!auth.user) {
    return <Redirect to="/auth/sign-in" />;
  }

  return children;
};

export default AuthGuard;
