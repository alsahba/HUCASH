import React, { Component } from 'react';
import { Form, Button, Header } from 'semantic-ui-react';

class PaymentDetails extends Component {
    state= {
        values:{}
    }

    componentWillMount(){
        this.setState({
            values:this.props.values
        })
    }

    saveAndContinue = (e) => {
        e.preventDefault()
        this.props.nextStep()
    }

    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() {
        const { values } = this.props;
        return (
            <Form color='green' >
                <Header size='large'>Payment Details</Header>
                <Header size='tiny' textAlign='left'>Enter the name on the credit card</Header>
                <Form.Input
                    placeholder='Name'
                    onChange={this.props.handleChange('cardName')}
                    defaultValue={values.cardName}
                >
                </Form.Input>
                <Form.Input
                    placeholder='Surname'
                    onChange={this.props.handleChange('cardSurname')}
                    defaultValue={values.cardSurname}
                >
                </Form.Input>
                <Header size='tiny' textAlign='left'>Enter the credit card number</Header>
                <Form.Group widths='four' >
                    <Form.Input
                        placeholder='1234'
                        onChange={this.props.handleChange('cardNo1')}
                        defaultValue={values.cardNo1}
                    >
                    </Form.Input>
                    <Form.Input
                        placeholder='1234'
                        onChange={this.props.handleChange('cardNo2')}
                        defaultValue={values.cardNo2}
                    >
                    </Form.Input>
                    <Form.Input
                        placeholder='1234'
                        onChange={this.props.handleChange('cardNo3')}
                        defaultValue={values.cardNo3}
                    >
                    </Form.Input>
                    <Form.Input
                        placeholder='1234'
                        onChange={this.props.handleChange('cardNo4')}
                        defaultValue={values.cardNo4}
                    >
                    </Form.Input>
                </Form.Group>
                <Header size='tiny' textAlign='left'>Enter the CVV code</Header>
                <Form.Input width='five'
                    placeholder='CVV'
                >
                </Form.Input>
                <Button onClick={this.back} secondary>Back</Button>
                <Button onClick={this.saveAndContinue} secondary inverted> Go to Confirmation </Button>
            </Form>
        )
    }
}

export default PaymentDetails;