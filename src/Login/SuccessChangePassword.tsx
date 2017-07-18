import * as React from 'react'
import './Login.css'
import axios from 'axios'
import ChangeSessionToken from '../Utils/ChangeSessionToken'
import VerifyAccountActivation from '../Utils/VerifyAccountActivation'
import Loading from '../GenericComponents/Loading'
import LoginEmail from './LoginEmail'
import LoginPassword from './LoginPassword'
import LogoFlyve from './LogoFlyve'
import ErrorInput from './ErrorInput'
import config from '../config'
import Credentials from './Credentials'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
let WinJS = require('winjs')    
import { Link } from 'react-router-dom'

function mapStateToProps(state, props) {
    return {
        userName: state.Login.userName
    }
}

function mapDispatchToProps(dispatch) {
    const actions = {}
    return { actions }
}

class VerifyYourEmail extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
    }

    componentDidMount () {
        WinJS.UI.Animation.enterContent(
            document.querySelector('.enterContentAnimation'), 
            { top: '0px', left: '200px' },
            {
                mechanism: 'transition'
            }
        )
    }

    render () {
        return (
            <div className="LoginForm">
                <div id="maincontent">
                    <div className="centerText" id="validateUser">
                        <LogoFlyve history={this.props.history}/>
                        <div className="enterContentAnimation">
                            <h1>
                                Your account has recovered
                            </h1>
                            <p>
                                Now you can use your new security information to log into your account.
                            </p>
                            <p>
                                <strong>
                                    Successful password change
                                </strong>
                            </p>
                            
                            <button 
                                className="win-button color-accent color-type-primary-alt"
                                type="button"
                                onClick={() => this.props.history.push('/login')} 
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
                <Credentials />
            </div>
        )
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(VerifyYourEmail)