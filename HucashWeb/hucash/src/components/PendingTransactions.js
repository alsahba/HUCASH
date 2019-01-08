import React, { Component } from 'react';
import { Item, Icon, Segment, Grid, Divider, Header, Label, Button, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';

export class PendingTransactions extends Component {
    state = {
        baseUrl: 'http://46.101.212.47:8000',
        userInfo: {},
        transactions: [],
        sender: '',
        receiver: '',
        dimmerActive: false,
    }

    componentWillMount() {
        console.log('PENDING TRANSACTIONS USER INFO: ', this.props.userInfo);
        this.setState({
            userInfo: this.props.userInfo
        })
    }

    getTransactions() {
        this.setState({
            dimmerActive: true
        });
        axios.get(this.state.baseUrl + '/transaction/pending/show?username=' + this.state.userInfo.customerId)
            .then(res => {
                console.log('RESPONSE PENDING TRANSACTIONS', res.data);

                if (res.data.error) {
                    console.log('!!!ERROR: PENDING TRANSACTION!!!');
                    alert('ERROR ! '+res.data.error);
                }
                else if (!res.data.error) {
                    this.setState({
                        transactions: res.data
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

    componentDidMount() {

        this.getTransactions();
    }

    confirmTransaction = (item) => {
        this.setState({
            dimmerActive: true
        });
        axios.get(this.state.baseUrl + '/transaction/confirm?protoTxId=' + item.transactionPrototypeId)
            .then(res => {
                console.log('RESPONSE CONFIRM PENDING TRANSACTIONS', res.data);

                if (res.data.error) {
                    console.log('!!!ERROR: CONFIRM PENDING TRANSACTION!!!');
                    alert('ERROR ! '+res.data.error);
                }
                else if (!res.data.error) {
                    alert('Confirmation succeed!');
                    this.getTransactions();
                }
                this.setState({
                    dimmerActive: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });


    }
    cancelTransaction = (item) => {
        this.setState({
            dimmerActive: true
        });
        axios.get(this.state.baseUrl + '/transaction/cancel?protoTxId=' + item.transactionPrototypeId)
            .then(res => {
                console.log('RESPONSE CANCEL PENDING TRANSACTIONS', res.data);

                if (res.data.error) {
                    console.log('!!!ERROR: CANCEL PENDING TRANSACTION!!!');
                    alert('ERROR ! '+res.data.error);
                }
                else if (!res.data.error) {
                    alert('Cancel succeed!');
                    this.getTransactions();
                }
                this.setState({
                    dimmerActive: true
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    splitItem(inp) {
        //var input = "" + inp;
        var fields = inp.split('#');

        var username = fields[1];
        // this.setState({
        //     sender: fields[1]
        // })
        console.log('SPLITTED' + username);
        if(username){
            return username;
        }else{
             return inp;
        }
       

    }

    render() {
        return (
            <div>
                <Header as='h2' align='center' > Pending Transactions</Header>
                <Item.Group divided relaxed >
                    {this.state.transactions.map((item) => {
                        item.sender= this.splitItem(item.sender);
                        item.receiver= this.splitItem(item.receiver);
                        return (
                            <Item key={this.state.transactions.indexOf(item)}>
                                <Item.Content>
                                    <Item.Header><strong>Transaction </strong>{(this.state.transactions.indexOf(item) + 1)}</Item.Header>
                                    <Item.Description>
                                        <Grid centered columns='two' padded>
                                            <Grid.Column verticalAlign='middle'>
                                                <Segment textAlign='center' compact circular >
                                                    <Grid columns={2} centered >
                                                        <Grid.Column>
                                                            <h4>Sender</h4> <p>{item.sender}</p>
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
                                                            <h4>Transaction Amount </h4>
                                                            <Label.Detail >
                                                                {item.amount}
                                                            </Label.Detail>
                                                        </Label>
                                                    </Grid.Column>
                                                    <Grid.Column align='middle'>
                                                        <Label color='grey'>
                                                            <h4>Remaining Balance </h4>
                                                            <Label.Detail>
                                                                {item.remainingBalance}
                                                            </Label.Detail>
                                                        </Label>
                                                    </Grid.Column>
                                                </Grid>
                                            </Grid.Column>
                                            <Grid.Column verticalAlign='middle'>
                                                <Grid centered align='middle' >
                                                    <Button onClick={() => this.confirmTransaction(item)} color='green' inverted>Confirm</Button>
                                                    <Button onClick={() => this.cancelTransaction(item)} color='red' inverted>Cancel</Button>
                                                </Grid>
                                            </Grid.Column>
                                        </Grid>
                                    </Item.Description>
                                    <Item.Extra>
                                        <span>{new Date().toLocaleString()}</span>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
    
    
                        );
                    })}

                </Item.Group>

                <Dimmer inverted active={this.state.dimmerActive}>
                    <Loader inverted />
                </Dimmer>

            </div>


        )
    }


}