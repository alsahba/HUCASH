import React, { Component } from 'react';
import { Container, Menu, Icon, Card, Grid, Label, Button, Modal, Input } from 'semantic-ui-react';
import QRCode from 'qrcode.react';
import ReactCountdownClock from 'react-countdown-clock';

class App extends Component {
  state = {
    open: false,
    openQr: false,
    price: '',
    username: '',
    secondsRemaining: 30
  }
  show = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  showQr = () => this.setState({ openQr: true })
  closeQr = () => this.setState({ openQr: false })

  buyBag1 = () => {
    this.setState({
      price: 10
    });
    this.show();
  }
  buyBag2 = () => {
    this.setState({
      price: 250
    });
    this.show();
  }
  buyBag3 = () => {
    this.setState({
      price: 120
    });
    this.show();
  }
  buyBag4 = () => {
    this.setState({
      price: 50
    });
    this.show();
  }
  generateQrCode = () => {
    console.log(this.state.username, this.state.price);
    this.close();
    this.showQr();
  }
  TimeisUp = () => {
    this.closeQr();
    this.show();
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Menu color='blue' fluid widths={1} compact fixed='top' inverted>
          <Container>
            <Menu.Item as='h1' header>
              <Icon name='shopping basket' size='big' />
              HEPSİSURADA.COM
            </Menu.Item>
          </Container>
        </Menu>



        <Card.Group centered style={{ marginTop: '10em' }}>
          <Grid centered columns='two' >
            <Grid.Row>
              <Grid.Column >
                <Card centered>
                  <Card.Content textAlign='center'>
                    <Card.Header><Icon color='brown' name='suitcase' size='massive' /></Card.Header>
                    <Card.Meta><h1>BAG 1</h1></Card.Meta>
                    <Card.Description>
                      <Grid.Column style={{ padding: '1em' }}>
                        <Label color='green' size='large' tag as='a'>$10.00</Label>
                      </Grid.Column>
                      <Grid.Column>
                        <Button onClick={() => this.buyBag1()} color='blue' inverted>Buy with Hucash</Button>
                      </Grid.Column>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card centered>
                  <Card.Content textAlign='center'>
                    <Card.Header><Icon color='grey' name='suitcase' size='massive' /></Card.Header>
                    <Card.Meta><h1>BAG 2</h1></Card.Meta>
                    <Card.Description>
                      <Grid.Column style={{ padding: '1em' }}>
                        <Label color='green' size='large' tag as='a'>$250.00</Label>
                      </Grid.Column>
                      <Grid.Column>
                        <Button onClick={() => this.buyBag2()} color='blue' inverted>Buy with Hucash</Button>
                      </Grid.Column>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Card centered >
                  <Card.Content textAlign='center'>
                    <Card.Header><Icon color='teal' name='suitcase' size='massive' /></Card.Header>
                    <Card.Meta><h1>BAG 3</h1></Card.Meta>
                    <Card.Description>
                      <Grid.Column style={{ padding: '1em' }}>
                        <Label color='green' size='large' tag as='a'>$120.00</Label>
                      </Grid.Column>
                      <Grid.Column>
                        <Button onClick={() => this.buyBag3()} color='blue' inverted>Buy with Hucash</Button>
                      </Grid.Column>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card centered >
                  <Card.Content textAlign='center'>
                    <Card.Header><Icon color='violet' name='suitcase' size='massive' /></Card.Header>
                    <Card.Meta><h1>BAG 4</h1></Card.Meta>
                    <Card.Description>
                      <Grid.Column style={{ padding: '1em' }}>
                        <Label color='green' size='large' tag as='a'>$50.00</Label>
                      </Grid.Column>
                      <Grid.Column>
                        <Button onClick={() => this.buyBag4()} color='blue' inverted>Buy with Hucash</Button>
                      </Grid.Column>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>

          </Grid>

        </Card.Group>

        <Modal size='tiny' open={this.state.open} onClose={this.close}>
          <Modal.Header>Enter your Hucash username.</Modal.Header>
          <Modal.Content>
            <Input
              placeholder='Hucash Username..'
              value={this.state.username}
              onChange={(e) => {
                this.setState({ username: e.target.value });
              }} />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.generateQrCode()} positive icon='arrow right' labelPosition='right' content='Generate QRCode' />
          </Modal.Actions>
        </Modal>

        <Modal closeIcon size='tiny' open={this.state.openQr} onClose={this.closeQr}>
          <Modal.Header>QR CODE</Modal.Header>
          <Modal.Content>
            <Grid columns='two'>
              <Grid.Column>
                <QRCode
                  value={this.state.username + "-" + this.state.price + "-hepsisurada"}
                  size={200}
                  bgColor='#FFF'
                  fgColor='#000'
                />
              </Grid.Column>
              <Grid.Column style={{textAlign:'center'}}>
                <p>Please scan the QR code within the specified time.</p>
                <ReactCountdownClock
                  seconds={20}
                  showMilliseconds={false}
                  color='green'
                  alpha={0.8}
                  weight={5}
                  size={150}
                  onComplete={this.TimeisUp}
                />
              </Grid.Column>
            </Grid>
          </Modal.Content>
        </Modal>


      </div>
    );
  }
}

export default App;
