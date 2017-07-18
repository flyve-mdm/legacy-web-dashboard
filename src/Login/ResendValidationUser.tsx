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

class ResendValidationUser extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
           userName: 'example@flyve.com',
           classButton: 'win-button color-accent color-type-primary-alt',
           disabledButton: false,
           loading: <span />,
           componentLoaded: true,
           messageHeader: 'The link will be active for 1 day',
           // tslint:disable-next-line:jsx-wrap-multiline
           padding: <div>
                        <h4>
                            To verify that is your email address, open
                            your mailbox and find the email with the
                            subject: Account Activation
                        </h4>
                    </div>
        }
    }

    resendValidation () {
        this.setState({
            loading: <Loading className="loagind-form color-bg-light-vivid-mid"/>,
            disabledButton: true,
            classButton: 'win-button'
        })
        axios.post ('https://dev.flyve.org/glpi/apirest.php/', {
                // login: config.userAdminName,
                // password: config.userAdminPassword
            }) 
                .then((response) => {
                    console.log(response)
                    this.setState({
                        loading: <span/>
                    })
                    setTimeout( 
                        () => {
                            this.setState({
                                disabledButton: false,
                                classButton: 'win-button color-accent color-type-primary-alt'
                            })
                        }, 
                        3000
                    )
                }) 
                .catch((error) => {
                    console.log(error.response)
                    this.setState({
                        loading: <span/>,
                        disabledButton: false,
                        classButton: 'win-button color-accent color-type-primary-alt',
                        padding: <div className="color-type-alert">{error.response.data[1]}</div> 
                    })
                })
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
                        <LogoFlyve />
                        <div className="enterContentAnimation">
                            <h1>
                                Verify your email address
                            </h1>
                            <h3>
                                You're almost done! A verification message has been sent to
                                <br />
                                <strong>{this.state.userName}</strong>
                            </h3>
                            <h4>
                                Just check your email and follow the link to finish creating your 
                                Flyve MDM Account. Entered the wrong address? 
                                <a href="#"> Change your email</a>.
                            </h4>
                            <div className="separator" />
                            <p>
                                Can't find the email? 
                                <a href="#"> Resend verification email </a>
                                or 
                                <a href="#"> visit the help center</a>
                            </p>
                            {this.state.loading}
                        </div>
                        <Credentials />
                    </div>
                </div>
            </div>
        )
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(ResendValidationUser)