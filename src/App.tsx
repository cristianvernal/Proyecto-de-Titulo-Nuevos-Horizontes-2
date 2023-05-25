import DateFnsUtils from "@date-io/date-fns";
import {
  jssPreset,
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { create } from "jss";
import React, { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/macro";
import { validateSession } from "./redux/actions/authActions";
import { RootState } from "./redux/reducers/rootReducer";
import { IThemeState } from "./redux/reducers/themeReducer";
import Routes from "./routes/Routes";
import createTheme from "./theme";
import { GlobalStyles } from "./theme/useStyles";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point") as any,
});

export function App() {
  const theme = useSelector<RootState, IThemeState>(
    (state) => state.themeReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateSession());
  }, [dispatch]);

  return (
    <React.Fragment>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s | Nuevos Horizontes"
          defaultTitle="Nuevos Horizontes - Admin"
        />
        <StylesProvider jss={jss}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
              <ThemeProvider theme={createTheme(theme.currentTheme)}>
                <GlobalStyles />
                <Routes />
              </ThemeProvider>
            </MuiThemeProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </HelmetProvider>
    </React.Fragment>
  );
}
