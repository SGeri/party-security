import React from "react";
import axios from "axios";
import QrReader from "react-qr-reader";
import { Label, Button, Segment, Loader } from "semantic-ui-react";

const styles = {
  successText: {
    position: "absolute",
    top: "45%",
    left: "25%",
    transform: "transform: translate(-50%, -50%)",
    TextAlign: "center",
  },
};

class Dashboard extends React.Component {
  state = {
    ticketType: "",
    scanReady: true,
    loading: false,
    success: false,
    requestError: "",
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
        this.setState({ requestError: "ERR::REQ" });
      });
    this.setState({ loading: false });
    setTimeout(() => {
      this.setState({ scanReady: true, ticketType: "", requestError: false });
    }, 5000);
  };

  handleError = () => {
    this.setState({ requestError: "ERR::PERMISSION" });
    setTimeout(() => {
      this.setState({ requestError: "" });
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
        <h1 style={{ margin: "5px" }}>Biztonsági kliens</h1>

        <Segment style={{ margin: "5px" }}>
          <Loader active={loading} />

          <QrReader
            delay={1000}
            style={{ width: "100%" }}
            onError={this.handleError}
            onScan={this.handleScan}
            facingMode={this.state.facingMode}
          />

          <div>
            {!scanReady && success && (
              <Label style={styles.successText} color="blue" size="huge">
                Érvényes kód
                <br />
                {ticketType}
              </Label>
            )}

            {!scanReady && !success && (
              <Label style={styles.successText} color="red" size="huge">
                Érvénytelen kód
              </Label>
            )}

            {requestError && (
              <Label style={styles.successText} color="red" size="huge">
                {requestError === "ERR::REQ" ? (
                  <div>
                    Hiba a szerver kapcsolatban
                    <br />
                    Keress meg egy fejlesztőt!
                  </div>
                ) : (
                  <div>Engedélyezd a kamerát</div>
                )}
              </Label>
            )}
          </div>

          <div style={{ paddingTop: "10px" }}>
            <Button
              onClick={() => {
                this.setState({ facingMode: "user" });
              }}
            >
              Előlapi kamera
            </Button>

            <Button
              onClick={() => {
                this.setState({ facingMode: "environment" });
              }}
            >
              Hátlapi kamera
            </Button>

            <h4>
              Jelenleg:{" "}
              {this.state.facingMode === "user" ? "Előlapi" : "Hátlapi"} kamera
            </h4>
          </div>
        </Segment>

        <Button style={{ marginLeft: "5px" }} onClick={this.onLogout}>
          Kijelentkezés
        </Button>
      </div>
    );
  }
}

export default Dashboard;
