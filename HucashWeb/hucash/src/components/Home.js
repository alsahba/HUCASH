import React, { Component } from 'react';
import { Container, Menu, Icon, Button } from 'semantic-ui-react';
import { Route, NavLink, HashRouter } from "react-router-dom";
import { SendHucash } from './SendHucash';
import { BuyHucash } from './BuyHucash';
import { ShowWallet } from './ShowWallet';
import { TransactionHistory } from './TransactionHistory';
import { PendingTransactions } from './PendingTransactions';

export default class Home extends Component {
     state = {
          username: '',
          userInfo: {},
     }

     // componentDidMount(){

     //      this.setState({username:this.props.location.state.username});
     //      console.log(this.state.username);
     // }


     // componentWillMount(){
     //      this.setState({userInfo:this.props.userInfo});
     // }

     render() {
          return (
               <HashRouter>
                    <div>

                         <Menu fluid widths={7} compact fixed='top' inverted>
                              <Container>
                                   <Menu.Item as='h1' header>
                                        <Icon name='user circle outline' size='big' />
                                        {this.props.userInfo.firstName} {this.props.userInfo.lastName}
                                   </Menu.Item>
                                   <Menu.Item as={NavLink} exact to='/'>
                                        <Icon name='money bill alternate outline' size='large' />Show My Wallet
                                   </Menu.Item>
                                   <Menu.Item as={NavLink} to='/buyHucash'>
                                        <Icon name='credit card' size='large' />Buy Hucash
                                   </Menu.Item>
                                   <Menu.Item as={NavLink} to='/sendHucash' >
                                        <Icon name='send' size='large' />Send Hucash
                                   </Menu.Item>
                                   <Menu.Item as={NavLink} to='/pendingtransaction' >
                                        <Icon name='list alternate' size='large' />Pending Transactions
                                   </Menu.Item>
                                   <Menu.Item as={NavLink} to='/transaction'>
                                        <Icon name='list alternate outline' size='large' />List Transaction History
                                   </Menu.Item>
                                   <Menu.Item as={Button} >
                                        <Icon name='power off' size='large'></Icon>
                                   </Menu.Item>
                              </Container>
                         </Menu>


                         <Container text style={{ marginTop: '10em' }}>
                              <Route path="/buyHucash"
                                   render={(props) => <BuyHucash {...props} userInfo={this.props.userInfo} />} />
                              <Route path="/sendHucash"
                                   render={(props) => <SendHucash {...props} userInfo={this.props.userInfo} />} />
                              <Route exact path="/"
                                   render={(props) => <ShowWallet {...props} userInfo={this.props.userInfo} />} />
                              <Route path="/pendingtransaction"
                                   render={(props) => <PendingTransactions {...props} userInfo={this.props.userInfo} />} />
                              <Route path="/transaction"
                                   render={(props) => <TransactionHistory {...props} userInfo={this.props.userInfo} />} />
                              
                         </Container>
     
                    </div>
               </HashRouter>
                    )
               }
}