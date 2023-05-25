import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { authLayoutRoutes, protectedRoutes } from "./index";

import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import Page404 from "../pages/auth/Page404";
import { MainGuard } from "../components/MainGuard";

const childRoutes = (Layout, routes) =>
  routes.map(({ component: Component, guard, children, path }, index) => {
    const Guard = guard || React.Fragment;

    return children ? (
      children
        .reduce((acc, val) => acc.concat(val.children ? val.children : val), [])
        .map((element, index) => {
          const Guard = element.guard || React.Fragment;
          const ElementComponent = element.component || React.Fragment;

          return (
            <Route
              key={index}
              path={element.path}
              exact
              render={(props) => (
                <Layout>
                  <Guard>
                    <ElementComponent {...props} />
                  </Guard>
                </Layout>
              )}
            />
          );
        })
    ) : Component ? (
      <Route
        key={index}
        path={path}
        exact
        render={(props) => (
          <Layout>
            <Guard>
              <Component {...props} />
            </Guard>
          </Layout>
        )}
      />
    ) : null;
  });

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={MainGuard} />
      {childRoutes(DashboardLayout, protectedRoutes)}
      {childRoutes(AuthLayout, authLayoutRoutes)}
      <Route
        render={() => (
          <AuthLayout>
            <Page404 />
          </AuthLayout>
        )}
      />
    </Switch>
  </Router>
);

export default Routes;
