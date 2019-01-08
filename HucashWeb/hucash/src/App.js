import React, { Component } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import { Route, BrowserRouter,Redirect,Switch } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  if (isAuthenticated) {
      return <Component {...rest} />
  }
  else {
      return <Redirect to='/login' />
  }
}

class App extends Component {

  state={
    isAuthenticated:false,
    user:{}

  }
  
  handleAuth = val => {
    this.setState({ user : val });
  }

  handleIsAuth = val => {
    this.setState({ isAuthenticated : val });
  }

  componentDidMount(){
    console.log('APP',this.state.user);
  }

  render() {
    return (

      <BrowserRouter>
        <Switch>
          {/* <Route exact={true} path='/' render={() => (
            <div className="App">
              <Home />
            </div>
          )} /> */}
          <Route exact={true} path='/login' render={(props) => <Login {...props} handleAuth={this.handleAuth} handleIsAuth={this.handleIsAuth} />}  />
          <PrivateRoute  path='/' component={Home} isAuthenticated={this.state.isAuthenticated} userInfo={this.state.user} />
          {/* <Route exact={true} path='/home' render={props => (
            <Home {...props} />
          )} /> */}
        </Switch>
      </BrowserRouter>
    );
  }


}

export default App;
