import React, { Component } from 'react';
import { Button, Checkbox, Form, Input, Modal,Dimmer,Loader} from 'semantic-ui-react';
import axios from 'axios';

export class SendHucash extends Component {
    state = {
        baseUrl: 'http://46.101.212.47:8000',
        username: '',
        userInfo: {},
        // fName: '',
        // lName: '',
        amount: '',
        // availableAmount: 200,
        isAgree: false,
        open: false,
        openSucces: false
    }

    componentWillMount() {
        console.log('SEND HUCASH USER INFO: ', this.props.userInfo);
        this.setState({
            userInfo: this.props.userInfo
        })
    }

    submitSend = (e) => {
        this.close();
        this.setState({
            dimmerActive: true
        });
        axios.get(this.state.baseUrl + '/transaction/pending/create?senderId=' + this.state.userInfo.customerId
            + '&receiverId=' + this.state.username
            + '&amount=' + this.state.amount)
            .then(res => {
                console.log('RESPONSE', res.data);

                if (res.data.error) {
                    console.log('!!!ERROR: BUY HUCASH CONFIRM!!!')
                    alert('ERROR ! '+res.data.error);
                }
                else if (!res.data.error) {
                    this.close();
                    this.showSucces();
                }
                this.setState({
                    dimmerActive: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        e.preventDefault()
    }

    handleSend(event) {

        if (this.state.username.length === 0 || this.state.amount.length === 0) {
            alert('Please fill the blank areas');
            // } else if (this.state.amount > this.state.availableAmount) {
            //     alert('Unfortunately, you dont have the budget to transfer so much hucash!');
        } else if (!this.state.isAgree) {
            alert('Please check confirmation!');
        } else {
            console.log('USERNAME:', this.state.username,
                'TRANSFER AMOUNT:', this.state.amount, 'Confirm:', this.state.isAgree);
            this.show();

        }
        event.preventDefault();
    }

    show = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    showSucces = () => this.setState({ openSucces: true })
    closeSucces = () => this.setState({ openSucces: false })

    render() {
        return (
            // <Grid columns={1}>
            //     {/* <Grid.Column>
            //         <Step.Group fluid vertical>
            //             <Step active>
            //                 <Icon name='dollar' />
            //                 <Step.Content>
            //                     <Step.Title>Billing</Step.Title>
            //                     <Step.Description>Enter billing information</Step.Description>
            //                 </Step.Content>
            //             </Step>
            //         </Step.Group>
            //     </Grid.Column> */}

            //     <Grid.Column>

            //     </Grid.Column>
            // </Grid>
            <div>


                <Form>
                    <Form.Field control={Input} label='Receiver Info' placeholder='Username'
                        onChange={(e) => {
                            this.setState({ username: e.target.value });
                        }} />
                    {/* <Form.Field control={Input} placeholder='First name'
                    onChange={(e) => {
                        this.setState({ fName: e.target.value });
                    }} />
                <Form.Field control={Input} placeholder='Last name'
                    onChange={(e) => {
                        this.setState({ lName: e.target.value });
                    }} /> */}
                    <Form.Group widths='equal'>
                        <Form.Field control={Input} label='Transfer Amount' placeholder='Amount'
                            onChange={(e) => {
                                this.setState({ amount: e.target.value });
                            }} />
                        {/* <Form.Field control={Label} label='Available Balance' color='green' size='big'> {this.state.availableAmount} </Form.Field> */}
                    </Form.Group>

                    <Form.Field control={Checkbox} label='I agree this transaction' defaultChecked={this.state.isAgree}
                        onChange={(e) => {
                            this.setState({ isAgree: !this.state.isAgree });
                        }} />
                    <Form.Field color='purple' secondary control={Button}
                        onClick={(e) => this.handleSend(e)}>SEND HUCASH</Form.Field>
                </Form>

                <Modal size='tiny' open={this.state.open} onClose={this.close}>
                    <Modal.Header>Confirm Hucash Transfer</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to confirm Hucash transfer? </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.close} negative>No</Button>
                        <Button onClick={this.submitSend} positive icon='checkmark' labelPosition='right' content='Yes' />
                    </Modal.Actions>
                </Modal>
                <Modal size='tiny' open={this.state.openSucces} onClose={this.closeSucces}>
                    <Modal.Header>Succesful</Modal.Header>
                    <Modal.Content>
                        <p>Hucash transfer request was successfully completed! </p>
                        <p>You can confirm the transaction on pending transaction menu.</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.closeSucces} positive icon='checkmark' labelPosition='right' content='OK' />
                    </Modal.Actions>
                </Modal>
                <Dimmer inverted active={this.state.dimmerActive}>
                    <Loader inverted />
                </Dimmer>
            </div>
        )
    }


}