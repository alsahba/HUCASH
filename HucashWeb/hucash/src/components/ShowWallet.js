import React, { Component } from 'react';
import { Divider, Header, Icon, Card, Image, Segment, Grid ,Dimmer ,Loader} from 'semantic-ui-react';
import axios from 'axios';

export class ShowWallet extends Component {
    state = {
        baseUrl: 'http://46.101.212.47:8000',
        userInfo:{},
        walletInfo:{}
    }

    componentWillMount() {
        console.log('WAlLET USER INFO: ', this.props.userInfo);
        this.setState({
            userInfo:this.props.userInfo
        })
    }

    componentDidMount(){
        this.setState({
            dimmerActive: true
        });
        axios.get(this.state.baseUrl + '/wallet/show?username=' + this.state.userInfo.customerId)
            .then(res => {
                console.log('RESPONSE', res.data);
                
                if (res.data.error) {
                    console.log('!!!ERROR: GET USER WALLET!!!')
                    alert('ERROR ! '+res.data.error);
                }
                else if (!res.data.error) {
                    this.setState({
                        walletInfo:res.data
                    })
                }
                this.setState({
                    dimmerActive: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const square = { width: 175, height: 175 }
        return (

            <React.Fragment>
                <Divider horizontal>
                    <Header as='h3'>
                        Wallet Information
                     </Header>
                </Divider>


                <Card centered fluid>
                    <Card.Content>
                        <Image floated='right'><Icon name='user outline' size='huge'></Icon></Image>
                        <Card.Header>{this.state.userInfo.firstName} {this.state.userInfo.lastName}</Card.Header>
                        <Card.Meta>{this.state.userInfo.customerId}</Card.Meta>
                        <Card.Description >
                            <Grid centered>
                                {/* <Grid.Column >
                                    <Segment circular style={square} floated='left' >
                                        <Header.Subheader as='h3'>
                                            Wallet ID
                                        </Header.Subheader>
                                        <Header as='h1'> {this.state.walletInfo.walletId} </Header>
                                    </Segment>
                                </Grid.Column> */}

                                <Segment circular inverted style={square} floated='right'>
                                        <Header.Subheader as='h3'>
                                            Balance
                                        </Header.Subheader>
                                        <Header as='h1'> {this.state.walletInfo.balance}  </Header>
                                </Segment>
                                {/* <Grid.Column >
                                    <Segment circular inverted style={square} floated='right'>
                                        <Header.Subheader as='h3'>
                                            Balance
                                        </Header.Subheader>
                                        <Header as='h1'> {this.state.walletInfo.balance}  </Header>
                                    </Segment>
                                </Grid.Column> */}

                            </Grid>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {new Date().toLocaleString()}
                    </Card.Content>
                </Card>

                <Dimmer inverted active={this.state.dimmerActive}>
                    <Loader inverted />
                </Dimmer>
            </React.Fragment>

        )
    }


}