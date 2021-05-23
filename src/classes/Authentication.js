import React from "react";
import axios from "axios";
import { Grid, Header, Form, Label, Segment, Button } from "semantic-ui-react";

class Authentication extends React.Component {
  state = {
    key: "",
    error: "",
    loading: false,
  };

  onChange = (e) => {
    this.setState({ key: e.target.value });
  };

  onSubmit = async () => {
    if (!this.state.key) {
      this.setState({ error: "A biztonsági kulcs nem lehet üres!" });
    } else {
      this.setState({ loading: true });
      await axios
        .post("http://api.party.huroc.com:4200/login", { key: this.state.key })
        .then((res) => {
          if (res.data.success === true) {
            this.props.onAuthenticate(res.data.token);
          } else {
            this.setState({ error: "Helytelen kulcs", loading: false });
          }
        })
        .catch((e) => {
          this.setState({ error: e, loading: false });
        });
    }
  };

  render() {
    const { loading, error } = this.state;

    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="black" textAlign="center">
            Huroc Security
          </Header>
          <Form size="large" loading={loading}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="users"
                iconPosition="left"
                placeholder="Biztonsági kulcs"
                type="password"
                onChange={this.onChange}
              />

              <Button onClick={this.onSubmit} color="black" fluid size="large">
                Bejelentkezés
              </Button>

              {error && (
                <Label basic color="red" pointing>
                  {error}
                </Label>
              )}
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Authentication;
