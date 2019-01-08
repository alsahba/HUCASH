import React, { Component } from 'react';
import PurchaseDetails from './PurchaseDetails';
import PaymentDetails from './PaymentDetails';
import ConfirmationDetails from './ConfirmationDetails';

class MainForm extends Component {
    state = {
        baseUrl: 'http://46.101.212.47:8000',
        step: 1,
        username: '',
        purchaseAmount: '',
        cardName: '',
        cardSurname: '',
        cardNo1: '',
        cardNo2: '',
        cardNo3: '',
        cardNo4: '',
        userInfo:{}
        
    }
    componentWillMount() {
        console.log('MAIN FORM USER INFO: ', this.props.userInfo);
        this.setState({
            userInfo:this.props.userInfo,
            username:this.props.userInfo.customerId
        })
    }

    nextStep = () => {
        const { step } = this.state
        this.setState({
            step : step + 1
        })
        this.props.stepHandle(this.state.step);
    }

    prevStep = () => {
        const { step } = this.state
        this.setState({
            step : step - 1
        })
    }

    handleChange = input => event => {
        this.setState({ [input] : event.target.value })
    }
    
    render(){
        const {step} = this.state;
        const { username, purchaseAmount, cardName, cardSurname, cardNo1, cardNo2, cardNo3, cardNo4 } = this.state;
        const values = { username, purchaseAmount, cardName, cardSurname, cardNo1, cardNo2,cardNo3, cardNo4 };
        // eslint-disable-next-line
        switch(step) {
        case 1:
            return <PurchaseDetails 
                    nextStep={this.nextStep} 
                    handleChange = {this.handleChange}
                    values={values}
                    />
        case 2:
            return <PaymentDetails 
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleChange = {this.handleChange}
                    values={values}
                    />
        case 3:
            return <ConfirmationDetails 
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    values={values}
                    />
        }
    }
}

export default MainForm;