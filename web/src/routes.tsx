import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateCenter from "./pages/CreateCenter";

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/cadastro" component={CreateCenter} />
    </BrowserRouter>
  );
};

export default Routes;
