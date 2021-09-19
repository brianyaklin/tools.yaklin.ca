import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga4";

import theme from "./components/ui/Theme";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

import Page from "./components/pages/Page";
import HomePage from "./components/pages/Home";
import AboutPage from "./components/pages/About";
import SubnetCalculator from "./components/pages/SubnetCalculator";

const history = createBrowserHistory();

history.listen((location) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.send(location.pathname);
});

function App() {
  ReactGA.initialize("G-Y4FCF4K73S");
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter history={history}>
          <Header />
          <Switch>
            <Route
              exact
              path="/"
              component={() => (
                <Page title="Tools for Network Engineers">
                  <HomePage />
                </Page>
              )}
            />
            <Route
              exact
              path="/about"
              component={() => (
                <Page title="About">
                  <AboutPage />
                </Page>
              )}
            />
            <Route
              exact
              path="/subnet-calculator"
              component={() => (
                <Page title="Subnet Calculator">
                  <SubnetCalculator />
                </Page>
              )}
            />
          </Switch>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
