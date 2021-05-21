import React from "react";
import axios from "axios";
import QrReader from "react-qr-scanner";
import { Label, Button } from "semantic-ui-react";

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
    scan: "",
    scanReady: true,
    success: false,
    loading: false,
    error: "",
    ticketType: "",
  };

  onLogout = () => {
    this.props.onLogout();
  };

  handleScan = async (data) => {
    if (!data || !this.state.scanReady) return;

    console.log(data);

    this.setState({ scanReady: false });
    await axios
      .post("http://localhost:4200/keycheck", { key: data.text })
      .then((res) => {
        if (res.data.valid === true) {
          this.setState({ success: true, ticketType: res.data.ticketType });
        } else {
          this.setState({ success: false });
        }
      })
      .catch(() => {
        this.setState({ success: false });
      });
    setTimeout(() => {
      this.setState({ scanReady: true, ticketType: "" });
    }, 5000);
  };

  handleError = (err) => {
    this.setState({ error: err });
  };

  render() {
    const { success, scanReady, ticketType } = this.state;

    return (
      <div>
        <h1>Dashboard</h1>

        <div>
          <QrReader
            delay={1000}
            style={{ width: "100%" }}
            onError={this.handleError}
            onScan={this.handleScan}
          />

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
        </div>
        <Button onClick={this.onLogout}>Kijelentkezés</Button>
      </div>
    );
  }
}

export default Dashboard;
