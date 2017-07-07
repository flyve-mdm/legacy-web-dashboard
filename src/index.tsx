import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import Login from './Login'
import CreateAccount from './Login/CreateAccount'
import ValidateUser from './Login/ValidateUser'
import RecoverAccount from './Login/RecoverAccount'
import RevokeInvitation from './Login/RevokeInvitation'
import Users from './Users'
import ValidateAccount from './Login/ValidateAccount'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'
import './Colors.css'

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import Reducers from './reducers'

const store = createStore(Reducers)

ReactDOM.render(
  <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/createaccount" component={CreateAccount} />
          <Route path="/validateuser" component={ValidateUser} />
          <Route path="/recoveraccount" component={RecoverAccount} />
          <Route path="/revokeinvitation" component={RevokeInvitation} />
          <Route path="/users" component={Users} />
          <Route path="/validateaccount" component={ValidateAccount} />
        </Switch>
      </BrowserRouter >
    </Provider>,
  document.getElementById('app') as HTMLElement
)
