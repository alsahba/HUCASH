import React, { Component } from 'react';
import { Form, Button, Header } from 'semantic-ui-react';

class PurchaseDetails extends Component {
    state= {
        values:{}
    }

    componentWillMount(){
        this.setState({
            values:this.props.values
        })
    }

    saveAndContinue = (e) => {
        if(this.props.values.username.lenght===0 || this.props.values.purchaseAmount.lenght===0){
            alert('Please fill the blank areas! ');
        }
        else{
            this.props.nextStep();
        }

        e.preventDefault()
        
    }

    render() {
        const { values } = this.props;
        return (
            <Form color='green' >
                <Header size='large'>Purchase Details</Header>
                <Header size='tiny' textAlign='left'>Enter the username</Header>
                <Form.Input
                    icon='user' iconPosition='left'
                    placeholder='Username'
                    onChange={this.props.handleChange('username')}
                    defaultValue={values.username}
                >
                </Form.Input>
                <Header size='tiny' textAlign='left'>Enter the amount of Hucash you want to buy</Header>
                <Form.Input
                    icon='btc' iconPosition='left'
                    placeholder='Purchase Amount'
                    onChange={this.props.handleChange('purchaseAmount')}
                    defaultValue={values.purchaseAmount}
                >
                </Form.Input>
                <Button onClick={this.saveAndContinue} secondary inverted> Go to payment details </Button>
            </Form>
        )
    }
}

export default PurchaseDetails;