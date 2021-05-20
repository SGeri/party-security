import React from "react";
import QrReader from "react-qr-scanner";
import { Label, Button } from "semantic-ui-react";

class Dashboard extends React.Component {
  state = {
    scan: "",
    scanReady: true,
    success: false,
    loading: false,
    error: "",
  };

  onLogout = () => {
    this.props.onLogout();
  };

  handleScan = async (data) => {
    if (!data || !this.state.scanReady) return;

    this.setState({ loading: true });
    await axios
      .post("http://localhost:4200/keycheck", { key: data })
      .then((res) => {
        if (res.data.valid === true) {
          this.setState({ success: true });
        } else {
          this.setState({
            success: false,
            error: "Helytelen kulcs",
            loading: false,
          });
        }
      })
      .catch(() => {
        this.setState({ success: false });
      });
    setTimeout(() => {
      this.setState({ scanReady: true });
    }, 5000);
  };

  handleError = (err) => {
    this.setState({ error: err });
  };

  render() {
    const { success, error } = this.state;

    return (
      <div>
        <h1>Dashboard</h1>
        <QrReader
          delay={1000}
          style={{ width: "100%" }}
          onError={this.handleError}
          onScan={this.handleScan}
        />
        {error && (
          <Label basic color="red">
            {error}
          </Label>
        )}

        {success && (
          <Label basic color="green">
            Sikeres olvasás
          </Label>
        )}
        <Button onClick={this.onLogout}>Kijelentkezés</Button>
      </div>
    );
  }
}

export default Dashboard;
