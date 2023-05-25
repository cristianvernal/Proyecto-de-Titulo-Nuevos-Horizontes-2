import React from "react";
import { useSelector } from "react-redux";
import { IAuthState } from "../redux/reducers/authReducer";
import { RootState } from "../redux/reducers/rootReducer";
import { Redirect } from "react-router-dom";

export const MainGuard = () => {
  const auth = useSelector<RootState, IAuthState>((state) => state.authReducer);

  if (!auth.user) {
    return <Redirect to="/auth/sign-in" />;
  }
  return <Redirect to="/usuarios" />;
};
