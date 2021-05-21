import React from "react";
import ReactDOM from "react-dom";
import HttpsRedirect from "react-https-redirect";

import App from "./App";

import "semantic-ui-css/semantic.min.css";

ReactDOM.render(
  <HttpsRedirect>
    <App />
  </HttpsRedirect>,
  document.getElementById("root")
);
