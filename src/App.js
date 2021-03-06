import * as React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Form from './components/form.tsx';
import Welcome from './components/welcome.tsx';
import Success from './components/success.tsx';
import {connect} from "react-redux";

class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return <BrowserRouter>
      <Switch>
        <Route path="/add" render={props => <Form
            {...props}
            Me={{
              name:this.props.appState.name.split(' ')[0],
              lastname:this.props.appState.name.split(' ')[1]||'',
              id:-1,
              email:this.props.appState.email
            }}
          />}
        />
        <Route component={Success} path="/success" />
        <Route component={Welcome} path="/" />
      </Switch>
    </BrowserRouter>;
  }
}

export default connect((state) => ({
    appState : state.appState
  }))(App);