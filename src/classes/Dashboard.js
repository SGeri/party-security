import React from "react";
import axios from "axios";
import QrReader from "react-qr-scanner";
import { Label, Button, Segment, Loader } from "semantic-ui-react";

const styles = {
  successText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "transform: translate(-50%, -50%)",
    textAlign: "center",
  },
};

class Dashboard extends React.Component {
  state = {
    ticketType: "",
    scanReady: true,
    loading: false,
    success: false,
    requestError: false,
    facingMode: "user",
  };

  onLogout = () => {
    this.props.onLogout();
  };

  handleScan = async (data) => {
    if (!data || !this.state.scanReady) return;

    this.setState({ scanReady: false, loading: true });
    await axios
      .post("https://api.party.huroc.com/keycheck", {
        token: await localStorage.getItem("auth"),
        key: data.text,
      })
      .then((res) => {
        if (res.data.valid === true) {
          this.setState({ success: true, ticketType: res.data.ticketType });
        } else {
          this.setState({ success: false });
        }
      })
      .catch(() => {
        this.setState({ requestError: true });
      });
    this.setState({ loading: false });
    setTimeout(() => {
      this.setState({ scanReady: true, ticketType: "", requestError: false });
    }, 5000);
  };

  handleError = () => {
    this.setState({ requestError: true });
    setTimeout(() => {
      this.setState({ requestError: false });
    }, 5000);
  };

  render() {
    const {
      ticketType,
      scanReady,
      loading,
      success,
      requestError,
    } = this.state;

    return (
      <div>
        <h1>Dashboard</h1>

        <Segment>
          <Loader active={loading} />
          <QrReader
            delay={1000}
            style={{ width: "100%" }}
            onError={this.handleError}
            onScan={this.handleScan}
            facingMode={this.state.facingMode}
          />

          <button
            onClick={() => {
              this.setState({ facingMode: "user" });
            }}
          >
            user
          </button>

          <button
            onClick={() => {
              this.setState({ facingMode: "environment" });
            }}
          >
            environment
          </button>

          <button
            onClick={() => {
              this.setState({ facingMode: { exact: "user" } });
            }}
          >
            user2
          </button>

          <button
            onClick={() => {
              this.setState({ facingMode: { exact: "environment" } });
            }}
          >
            environment2
          </button>

          {this.state.facingMode}

          {!scanReady && success && (
            <Label style={styles.successText} color="green" size="huge">
              Helyes kód!
              <br />
              {ticketType}
            </Label>
          )}
          {!scanReady && !success && (
            <Label style={styles.successText} color="red" size="huge">
              Helytelen kód!
            </Label>
          )}
          {requestError && (
            <Label style={styles.successText} color="red" size="huge">
              Hiba a lekérdezéskor
              <br />
              Keress meg egy fejlesztőt!
            </Label>
          )}
        </Segment>

        <Button onClick={this.onLogout}>Kijelentkezés</Button>
      </div>
    );
  }
}

export default Dashboard;
