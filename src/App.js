import * as React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Form from './form.tsx';
import Welcome from './welcome.tsx';
import Success from './success.tsx';
import {connect} from "react-redux";
import { categories, coordinators } from './data.ts';

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
            Categories={categories}
            Coordinators={coordinators}
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