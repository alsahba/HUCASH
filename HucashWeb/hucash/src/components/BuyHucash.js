import React, { Component } from 'react';
import { Icon, Step, Segment, Grid } from 'semantic-ui-react';
import MainForm from './MainForm';

export class BuyHucash extends Component {
    state={
        
        userInfo:{},
        currentStep:1
    }

    componentWillMount() {
        console.log('BUY HUCASH USER INFO: ', this.props.userInfo);
        this.setState({
            userInfo:this.props.userInfo
        })
    }

    handleStep = val => {
        this.setState({
            currentStep : val
        })
        console.log('STEP:',this.state.currentStep);
    }

    render() {
        return (
            <Segment >
                <Grid columns={2} >
                    <Grid.Column>
                        <Step.Group vertical >
                            <Step>  
                                <Icon name='shop' />
                                <Step.Content>
                                    <Step.Title>1.Buy Hucash</Step.Title>
                                    <Step.Description>Choose your purchase options</Step.Description>
                                </Step.Content>
                            </Step>

                            <Step >
                                <Icon name='payment' />
                                <Step.Content>
                                    <Step.Title>2.Payment</Step.Title>
                                    <Step.Description>Enter payment information</Step.Description>
                                </Step.Content>
                            </Step>

                            <Step >
                                <Icon name='info' />
                                <Step.Content>
                                    <Step.Title>3.Confirm Payment</Step.Title>
                                </Step.Content>
                            </Step>
                        </Step.Group>
                    </Grid.Column>
                    <Grid.Column>
                        <MainForm userInfo={this.state.userInfo} stepHandle={this.handleStep}></MainForm>
                    </Grid.Column>
                </Grid>
            </Segment>






        )
    }
}