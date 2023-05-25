import {
  CssBaseline,
  Hidden,
  Paper as MuiPaper,
  Snackbar,
  withWidth,
} from "@material-ui/core";
import { isWidthUp } from "@material-ui/core/withWidth";
import { Alert } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components/macro";
import Header from "../components/AppBar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { SnackState } from "../models/snack-state";
import { closeSnack } from "../redux/actions/uiActions";

const drawerWidth = 258;

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.palette.background.default};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const Dashboard = ({ children, routes, width }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const dispatch = useDispatch();
  const {
    snack: { snackState, open, text },
  } = useSelector((state) => state.uiReducer);

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer>
        <Hidden mdUp implementation="js">
          <Sidebar
            routes={routes}
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Hidden>
        <Hidden smDown implementation="css">
          <Sidebar
            routes={routes}
            PaperProps={{ style: { width: drawerWidth } }}
          />
        </Hidden>
      </Drawer>
      <AppContent>
        <Header onDrawerToggle={handleDrawerToggle} />
        <MainContent
          style={{
            maxWidth: isWidthUp("md", width)
              ? `calc(100vw - ${drawerWidth}px)`
              : "",
          }}
          px={isWidthUp("lg", width) ? 12 : 5}
          py={5}
        >
          {children}
        </MainContent>
        <Footer />
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            dispatch(closeSnack());
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={
              (snackState === SnackState.SUCCESS && "success") ||
              (snackState === SnackState.ERROR && "error") ||
              "success"
            }
          >
            {text}
          </Alert>
        </Snackbar>
      </AppContent>
    </Root>
  );
};

export default withWidth()(Dashboard);
