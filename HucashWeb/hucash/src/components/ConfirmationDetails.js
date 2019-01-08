import React, { Component } from 'react';
import { Button, Header, Card ,Modal,Loader,Dimmer} from 'semantic-ui-react';
import axios from 'axios';

class ConfirmationDetails extends Component {

    state = {
        baseUrl: 'http://46.101.212.47:8000',
        values: {},
        open:false,
        openSucces:false
    }

    componentWillMount() {
        this.setState({
            values: this.props.values
        })
    }

    saveAndContinue = (e) => {
        this.setState({
            dimmerActive: true
        });
        axios.get(this.state.baseUrl + '/buyHucash?username=' + this.state.values.username
        +'&amount='+this.state.values.purchaseAmount)
            .then(res => {
                console.log('RESPONSE', res.data);
                
                if (res.data.error) {
                    console.log('!!!ERROR: BUY HUCASH CONFIRM!!!');
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

    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }
    show = ()  => this.setState({ open: true })
    close = () => this.setState({ open: false })
    showSucces = () => this.setState({ openSucces: true })
    closeSucces = () => this.setState({ openSucces: false })

    render() {
        const { values } = this.props;
        return (
            // <Form color='green' >
            <div>


                <Header size='large'>Confirmation</Header>
                <Card>
                    <Card.Content header='About User' />
                    <Card.Content>
                        <Header size='tiny' color='blue'>Purchased Account Username:</Header>
                        {values.username}
                        <Header size='tiny' color='blue'>Amount of Hucash to be purchased: </Header>
                        {values.purchaseAmount}
                    </Card.Content>
                </Card>
                <Card>
                    <Card.Content header='About Payment' />
                    <Card.Content>
                        <Header size='tiny' color='blue'>Credit Card Holder:  </Header>
                        {values.cardName} {values.cardSurname}
                        <Header size='tiny' color='blue'>Credit Card No:  </Header>
                        {values.cardNo1}-{values.cardNo2}-{values.cardNo3}-{values.cardNo4}
                    </Card.Content>
                </Card>

                <Button onClick={this.back} secondary >Back</Button>
                <Button onClick={this.show} secondary inverted> Confirm </Button>

                <Modal size='tiny' open={this.state.open} onClose={this.close}>
                    <Modal.Header>Confirm Purchase</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to confirm purchase? </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.close} negative>No</Button>
                        <Button onClick={this.saveAndContinue} positive icon='checkmark' labelPosition='right' content='Yes' />
                    </Modal.Actions>
                </Modal>
                <Modal size='tiny' open={this.state.openSucces} onClose={this.closeSucces}>
                    <Modal.Header>Succesful</Modal.Header>
                    <Modal.Content>
                        <p>Your purchase was successfully completed ! </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.closeSucces} positive icon='checkmark' labelPosition='right' content='OK' />
                    </Modal.Actions>
                </Modal>

                <Dimmer inverted active={this.state.dimmerActive}>
                    <Loader inverted />
                </Dimmer>
            </div>

            // </Form>
        )
    }
}

export default ConfirmationDetails;