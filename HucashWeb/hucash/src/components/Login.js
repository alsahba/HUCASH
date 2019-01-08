import React, { Component } from 'react';
import { Button, Divider, Form, Grid, Segment, Header, Icon, Modal ,Dimmer ,Loader,Image} from 'semantic-ui-react';
import axios from 'axios';
import logo from '../logo.png';


export default class Login extends Component {



    constructor(props) {
        super(props)
        this.state = {
            baseUrl: 'http://46.101.212.47:8000',
            username: '',
            password: '',
            signupUsername: '',
            signupFirstName: '',
            signupLastName: '',
            signupPassword: '',
            signupPasswordAgain: '',
            user: {},
            isAuth: false,
            show: false,
            showError: false,
            hideModalErrorLogin:false,
            dimmerActive:false,
        }
    }

    submitLogin(){
        this.setState({
            dimmerActive:true
        });
        axios.get(this.state.baseUrl + '/login?username=' + this.state.username +
            '&password=' + this.state.password )
            .then(res => {
                
                console.log('RESPONSE', res.data);
                
                if (res.data.error) {
                    this.showModalErrorLogin();
                }
                else if (!res.data.error) {
                    this.setState({
                        user:res.data,
                        isAuth:true
                    });
                    this.props.handleAuth(this.state.user);
                    this.props.handleIsAuth(this.state.isAuth);
                        this.props.history.push({
                            pathname: '/',
                            // state: {
                            //     username: this.state.username
                            // }
                        })

                }
                this.setState({
                    dimmerActive:false
                })

            })
            .catch(function (error) {
                console.log(error);
            });

    }
    handleLogin(event) {
        // console.log('USERNAME:', this.state.username, ' PASSWORD:', this.state.password, 'AUTH:', this.state.isAuth);
        // console.log(this.props);
        if (this.state.username.length === 0 ||this.state.password.length === 0) {
            alert('Please fill the blank areas. All areas must have be filled.');
        }
        else {
            this.submitLogin();
            console.log('LOGGED USER: ', this.state.user);
        }

        
        //this.props.history.push('/home'); 
          
        // this.props.handleAuth(this.state.user);
        // this.props.handleIsAuth(this.state.isAuth);
        // this.props.history.push({
        //     pathname: '/',
        //     state: {
        //         username: this.state.username
        //     }
        // })
        

        event.preventDefault();
        
    }

    hasNumbers(t) {
        return /\d/.test(t);
    }
    hasUpperCase(str) {
        return (/[A-Z]/.test(str));
    }
    hasLowerCase(str) {
        return (/[a-z]/.test(str));
    }
    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };
    showModalError = () => {
        this.setState({ showError: true });
    };

    hideModalError = () => {
        this.setState({ showError: false });
    };
    showModalErrorLogin = () => {
        this.setState({ showErrorLogin: true });
    };

    hideModalErrorLogin = () => {
        this.setState({ showErrorLogin: false });
    };

    submitRegister() {
        this.setState({
            dimmerActive:true
        })
        axios.get(this.state.baseUrl + '/register?username=' + this.state.signupUsername +
            '&password=' + this.state.signupPassword +
            '&firstName=' + this.state.signupFirstName + '&lastName=' + this.state.signupLastName)
            .then(res => {
                this.setState({
                    dimmerActive:false
                })
                console.log('RESPONSE', res.data);
                if (res.data.error) {
                    this.showModalError();
                }
                else if (!res.data.error) {
                    this.showModal();
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSignUp(event) {
        if (this.state.signupFirstName.length === 0 || this.state.signupLastName.length === 0 ||
            this.state.signupUsername.length === 0 || this.state.signupPassword.length === 0 || this.state.signupPasswordAgain.length === 0) {
            alert('Please fill the blank areas. All areas must have be filled.');
        }
        else if (this.state.signupUsername.length < 6 || this.state.signupPassword.length < 8 ||
            this.state.signupPasswordAgain.length < 8) {
            alert('Username must be a minimum of 6 characters. and password must be a minimum of 8 characters.')
        }
        else if (this.state.signupPassword !== this.state.signupPasswordAgain) {
            alert('Passwords must match.');
        }
        else if (!this.hasNumbers(this.state.signupPassword) ||
            !this.hasUpperCase(this.state.signupPassword) ||
            !this.hasLowerCase(this.state.signupPassword)) {
            alert('The password must contain uppercase letters, lowercase letters, and numbers !');
        }
        else {
            console.log('USER INFORMATION\n', this.state.signupFirstName, this.state.signupLastName,
                this.state.signupUsername, this.state.signupPassword, this.state.signupPasswordAgain);
            this.submitRegister();
        }



        event.preventDefault();
    }

    render() {
        return (
            <div className="App">


                <Image src={logo} size='tiny'></Image>
                <Header as='h1' dividing textAlign='center'>    
                    <Header.Content>WELCOME TO HUCASH</Header.Content>
                </Header>

                <Segment placeholder >
                    <Grid columns={2} relaxed='very' stackable>
                        <Grid.Column verticalAlign='middle'>
                            <Form>
                                <Form.Input icon='user' iconPosition='left' label='Username' placeholder='Username'
                                    onChange={(e) => {
                                        this.setState({ username: e.target.value });
                                    }} />
                                <Form.Input icon='lock' iconPosition='left' label='Password' placeholder='Password'
                                    type='password'
                                    onChange={(e) => {
                                        this.setState({ password: e.target.value });
                                    }} />

                                <Button onClick={(e) => this.handleLogin(e)} content='Login' secondary />

                            </Form>
                        </Grid.Column>



                        <Grid.Column verticalAlign='middle'>
                            <Form>
                                <Form.Input icon='user circle' iconPosition='left' label='Username' placeholder='Username'
                                    onChange={(e) => {
                                        this.setState({ signupUsername: e.target.value });
                                    }} />
                                <Form.Input icon='user outline' iconPosition='left' label='Name' placeholder='First Name'
                                    onChange={(e) => {
                                        this.setState({ signupFirstName: e.target.value });
                                    }} />
                                <Form.Input icon='user outline' iconPosition='left' placeholder='Last Name'
                                    onChange={(e) => {
                                        this.setState({ signupLastName: e.target.value });
                                    }} />
                                <Form.Input icon='lock' iconPosition='left' label='Password' placeholder='Choose Password'
                                    type='password'
                                    onChange={(e) => {
                                        this.setState({ signupPassword: e.target.value });
                                    }} />
                                <Form.Input icon='lock' iconPosition='left' placeholder='Enter password again'
                                    type='password'
                                    onChange={(e) => {
                                        this.setState({ signupPasswordAgain: e.target.value });
                                    }} />
                                <Button animated='fade' secondary
                                    onClick={(e) => this.handleSignUp(e)} >
                                    <Button.Content visible>Register Now</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='signup' />
                                    </Button.Content>
                                </Button>
                            </Form>
                        </Grid.Column>
                    </Grid>

                    <Divider vertical>Or</Divider>
                </Segment>

                <Modal open={this.state.show} onClose={this.hideModal} basic size='small'>
                    <Header content='Your user registration was successful !' />
                    <Modal.Content>
                        <p>
                            You may now log-in with the username and password you have chosen
                        </p>
                        <Icon name='sign-in' size='large'></Icon>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.hideModal} color='green' inverted>
                            <Icon name='checkmark' /> Okey
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Modal open={this.state.showError} onClose={this.hideModalError} basic size='small'>
                    <Header icon='close' content='Unfortunately your registration is unsuccessful ! ' />
                    <Modal.Content>
                        <p>
                            Please try to register again.
                        </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.hideModalError} color='green' inverted>
                            <Icon name='checkmark' /> Okey
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Modal open={this.state.showErrorLogin} onClose={this.hideModalErrorLogin} basic size='small'>
                    <Header icon='close' content='Unfortunately your login is unsuccessful ! ' />
                    <Modal.Content>
                        <p>
                            Please try to login again.
                        </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.hideModalErrorLogin} color='green' inverted>
                            <Icon name='checkmark' /> Okey
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Dimmer active={this.state.dimmerActive}>
                    <Loader />
                </Dimmer>

            </div>
        );
    }



}