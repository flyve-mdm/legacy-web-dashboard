import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import Login from './Login'
import CreateAccount from './Login/CreateAccount'
import ValidateUser from './Login/ValidateUser'
import VerifyYourEmail from './Login/VerifyYourEmail'
import EditEmailAddress from './Login/EditEmailAddress'
import SuccessChangePassword from './Login/SuccessChangePassword'
import ResendValidationUser from './Login/ResendValidationUser'
import RecoverAccount from './Login/RecoverAccount'
import RecoverAccountSuccess from './Login/RecoverAccountSuccess'
import RevokeInvitation from './Login/RevokeInvitation'
import RecoverAccountPasswordPage from './Login/RecoverAccountPasswordPage'
import Users from './Users'
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
          <Route path="/resendvalidationuser" component={ResendValidationUser} />
          <Route path="/validateuser" component={ValidateUser} />
          <Route path="/editemailaddress" component={EditEmailAddress} />
          <Route path="/successchangepassword" component={SuccessChangePassword} />
          <Route path="/verifyyouremail" component={VerifyYourEmail} />
          <Route path="/recoveraccount" component={RecoverAccount} />
          <Route path="/recoveraccountsuccess" component={RecoverAccountSuccess} />
          <Route path="/recoveraccountpasswordpage" component={RecoverAccountPasswordPage} />
          <Route path="/revokeinvitation" component={RevokeInvitation} />
          <Route path="/users" component={Users} />
        </Switch>
      </BrowserRouter >
    </Provider>,
  document.getElementById('app') as HTMLElement
)
