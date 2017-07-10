import * as React from 'react'
import './Login.css'
import axios from 'axios'
import ChangeSessionToken from '../Utils/ChangeSessionToken'
import VerifyAccountActivation from '../Utils/VerifyAccountActivation'
import Loading from '../GenericComponents/Loading'
import { bindActionCreators } from 'redux'
import { changeLoading, changeValue } from './DuckController'
import { connect } from 'react-redux'
import LoginEmail from './LoginEmail'
import LoginPassword from './LoginPassword'
import LogoFlyve from './LogoFlyve'
import Credentials from './Credentials'

function mapStateToProps(state, props) {
    return {
        loading: state.Login.loading,
        phase: state.Login.phase,
        userName: state.Login.userName,
        password: state.Login.password,
        messageSignIn: state.Login.messageSignIn
    }
}

function mapDispatchToProps(dispatch) {
    const actions = {
        changeValue: bindActionCreators(changeValue, dispatch),
        changeLoading: bindActionCreators(changeLoading, dispatch)
    }
    return { actions }
}

class Login extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        super(props)
    }

    render () {
        let form: JSX.Element
        if (this.props.phase === 1) {
            form = 
                // tslint:disable-next-line:jsx-wrap-multiline
                <LoginEmail 
                    userName={this.props.userName} 
                    changeValue={this.props.actions.changeValue}
                    changeLoading={this.props.actions.changeLoading}
                    messageSignIn={this.props.messageSignIn}
                />    
        } else {
            form = 
                // tslint:disable-next-line:jsx-wrap-multiline
                <LoginPassword 
                        userName={this.props.userName} 
                        password={this.props.password} 
                        changeValue={this.props.actions.changeValue}
                        changeLoading={this.props.actions.changeLoading}
                        history={this.props.history}
                />
        }
        return (
            <div className="LoginForm">
                <div id="maincontent">
                    <div id="signIn">
                        <LogoFlyve />
                        <div className="centerText">
                            {form}
                            {this.props.loading}
                        </div>
                        <div className="xs-col-1-1 ">
                            <Credentials />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(Login)