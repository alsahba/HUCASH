import React, { Component } from 'react';
import { Item, Icon, Segment, Grid, Divider, Header, Label, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';

export class TransactionHistory extends Component {
    state = {
        baseUrl: 'http://46.101.212.47:8000',
        userInfo: {},
        transactions: []
    }

    componentWillMount() {
        console.log('TRANSACTION HISTORY USER INFO: ', this.props.userInfo);
        this.setState({
            userInfo: this.props.userInfo
        })
    }

    componentDidMount() {
        this.setState({
            dimmerActive: true
        });
        axios.get(this.state.baseUrl + '/transaction/history?username=' + this.state.userInfo.customerId)
            .then(res => {
                console.log('RESPONSE TRANSACTION HISTORY', res.data);

                if (res.data.error) {
                    console.log('!!!ERROR: HISTORY TRANSACTION!!!');
                    alert('ERROR ! '+res.data.error);
                }
                else if (!res.data.error) {
                    this.setState({
                        transactions: res.data
                    });
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
        return (
            <div>
                <Header as='h2' align='center' > Transaction History</Header>
                <Item.Group divided relaxed >

                    {this.state.transactions.map((item) => (
                        <Item key={this.state.transactions.indexOf(item) + 1}>
                            <Item.Content>
                                <Item.Header><strong>Transaction </strong>{(this.state.transactions.indexOf(item) + 1)}</Item.Header>
                                <Item.Description>
                                    <Grid centered columns='two' padded>
                                        <Grid.Column verticalAlign='middle'>
                                            <Segment textAlign='center' compact circular >
                                                <Grid columns={2} centered >
                                                    <Grid.Column>
                                                        <h4>Sender</h4> <p>{this.state.userInfo.customerId}</p>
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <h4>Reciever</h4> <p>{item.receiver}</p>
                                                    </Grid.Column>
                                                </Grid>
                                                <Divider vertical><Icon name='arrow circle right'></Icon></Divider>
                                            </Segment>
                                        </Grid.Column>
                                        <Grid.Column verticalAlign='middle'>
                                            <Grid columns={2} align='middle' >
                                                <Grid.Column >
                                                    <Label color='grey'>
                                                        <h4>Old Balance: </h4>
                                                        <Label.Detail >
                                                            {item.oldBalance}
                                                        </Label.Detail>
                                                    </Label>
                                                </Grid.Column>
                                                <Grid.Column align='middle'>
                                                    <Label color='grey'>
                                                        <h4>New Balance: </h4>
                                                        <Label.Detail>
                                                            {item.newBalance}
                                                        </Label.Detail>
                                                    </Label>
                                                </Grid.Column>
                                            </Grid>
                                        </Grid.Column>
                                    </Grid>
                                </Item.Description>
                                <Item.Extra>
                                    <span>{new Date().toLocaleString()}</span>
                                </Item.Extra>
                            </Item.Content>
                        </Item>


                    ))}
                </Item.Group>

                <Dimmer inverted active={this.state.dimmerActive}>
                    <Loader inverted />
                </Dimmer>

            </div>


        )
    }


}