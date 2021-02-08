import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Statement from "../pages/getStatement";
import AccessCode from "../pages/getAcsCode";

class router extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/statement/" exact>
            <Statement />
          </Route>
          <Route path="/accessCode/" exact>
            <AccessCode />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default router;
