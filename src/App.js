import React from "react";

import Dashboard from "./classes/Dashboard";
import Authentication from "./classes/Authentication";

class App extends React.Component {
  state = {
    isAuthenticated: false,
  }; //asd

  componentDidMount() {
    if (localStorage.getItem("auth")) {
      this.setState({ isAuthenticated: true });
    }
  }

  onAuthenticate = (token) => {
    this.setState({ isAuthenticated: true });
    localStorage.setItem("auth", token);
  };

  onLogout = () => {
    this.setState({ isAuthenticated: false });
    localStorage.removeItem("auth");
  };

  render() {
    const { isAuthenticated } = this.state;

    return (
      <div>
        {isAuthenticated ? (
          <Dashboard onLogout={this.onLogout} />
        ) : (
          <Authentication onAuthenticate={this.onAuthenticate} />
        )}
      </div>
    );
  }
}

export default App;
