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
let ReactWinJS = require('react-winjs')
import { bindActionCreators } from 'redux'
import { changeValue } from './DuckController'
import { connect } from 'react-redux'
let WinJS = require('winjs')    
import { Link } from 'react-router-dom'

function mapStateToProps(state, props) {
    return {}
}

function mapDispatchToProps(dispatch) {
    const actions = {
        changeValue: bindActionCreators(changeValue, dispatch)
    }
    return { actions }
}

class CreateAccount extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
            firstName: '',
            lastName: '',
            userName: '',
            password: '',
            reenterPassword: '',
            captcha: '',
            showErrors: false,
            suscribe: true,
            loading: <span />,
            message: <span />,
            disabledButton: false,
            classButton: 'win-button color-accent color-type-primary-alt'
        }
    }

    changeInput = (input) => {
        this.setState({[input.target.name]: input.target.value})
    }

    changeShowErrors = () => {
        this.setState({showErrors: true})
    }

    validateAndSend = (e) => {
        e.preventDefault()

        this.changeShowErrors()
        let DATA_FORM = {
            userName: this.state.userName,
            password: this.state.password,
            reenterPassword: this.state.reenterPassword,
            suscribe: this.state.suscribe
        }

        let validForm = true

        for (let prop in DATA_FORM) {
            if (DATA_FORM[prop] === '') {
                validForm = false
            } 
        }

        // tslint:disable-next-line:max-line-length
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(this.state.userName)) {
            validForm = false
        } 
        if (this.state.password.length < 8 ) {
            validForm = false
        }
        if (this.state.password !== this.state.reenterPassword) {
            validForm = false
        }
        if (validForm) {
            this.setState({
                loading: <Loading className="loagind-form color-bg-light-vivid-mid"/>,
                disabledButton: true,
                classButton: 'win-button'
            })
            axios.post ('https://dev.flyve.org/glpi/apirest.php/initSession', {
                login: config.userAdminName,
                password: config.userAdminPassword
            }) 
                .then((response) => {
                    console.log(response)
                    axios({
                        method: 'post',
                        url: 'https://dev.flyve.org/glpi/apirest.php/User',
                        headers: {
                            'Session-Token': response.data.session_token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            input: {
                                name: this.state.userName,
                                password: this.props.password,
                                password2: this.props.reenterPassword,
                                firstName: this.props.firstName,
                                lastName: this.props.lastName
                            }
                        }
                    }) 
                        .then((response2) => {
                            console.log(response2)
                            this.props.actions.changeValue('userName', this.state.userName)
                            this.setState({
                                loading: <span />,
                                classButton: 'win-button color-accent color-type-primary-alt',
                                disabledButton: false,
                                message: ''
                            })
                            this.props.history.push('/validateuser')
                        })
                        .catch((error) => {
                            console.log(error.response)
                            this.props.actions.changeValue('userName', this.state.userName)
                            this.setState({
                                loading: <span />,
                                classButton: 'win-button color-accent color-type-primary-alt',
                                disabledButton: false,
                                message: <p className="color-type-alert">{error.response.data[1]}</p>
                            })

                        })
                })
        } else {
            this.setState({
                password: '',
                reenterPassword: ''
            })
        }
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
                    <div id="createAccount">
                        <LogoFlyve />
                        <div className="enterContentAnimation">
                            <div className="centerText title"> 
                                <h1>
                                    Create an account
                                </h1>
                                <Link to="login">Sign in</Link>
                            </div>
                            <form onSubmit={this.validateAndSend}>
                                
                                <div className="xs-col-1-2">
                                    <label>First name</label>
                                    <input 
                                        name="firstName"
                                        className="win-textbox"
                                        id="firstName" 
                                        value={this.state.firstName} 
                                        onChange={this.changeInput} 
                                    />
                                </div>
                                <div className="xs-col-1-2">
                                    <label>Last name</label>
                                    <input 
                                        name="lastName"
                                        className="win-textbox" 
                                        id="lastName" 
                                        value={this.state.lastName} 
                                        onChange={this.changeInput} 
                                    />
                                </div>
                                <div className="xs-col-1-1">
                                    <label>User name</label>
                                    <input 
                                        name="userName"
                                        className="win-textbox" 
                                        id="userName" 
                                        type="email"
                                        value={this.state.userName} 
                                        onChange={this.changeInput} 
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="userName" 
                                        value={this.state.userName} 
                                        showErrors={this.state.showErrors}
                                    />
                                </div>
                                <div className="xs-col-1-1">
                                    <label>Password</label>
                                    <input 
                                        name="password"
                                        className="win-textbox" 
                                        id="password" 
                                        value={this.state.password} 
                                        type="password" 
                                        onChange={this.changeInput} 
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="password" 
                                        value={this.state.password} 
                                        showErrors={this.state.showErrors}
                                    />
                                </div>
                                <div className="xs-col-1-1">
                                    <label>Reenter Password</label>
                                    <input 
                                        name="reenterPassword"
                                        className="win-textbox" 
                                        id="reenterPassword" 
                                        value={this.state.reenterPassword} 
                                        type="password" 
                                        onChange={this.changeInput} 
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="reenterPassword" 
                                        value={this.state.reenterPassword} 
                                        password={this.state.password} 
                                        showErrors={this.state.showErrors}
                                    />
                                    <label className="color-type-secondary">
                                        8-character minimun; case sensitive   
                                    </label>
                                </div>
                                <div className="captcha">
                                    <div className="xs-col-1-2 ">
                                        <div className="color-bg-dark-vivid-high centerText centerContent">
                                            <p className="color-type-primary-alt">
                                                CAPTCHA
                                            </p>
                                        </div>
                                    </div>
                                    <div className="xs-col-1-2 ">
                                        <button type="submit" className="win-button">
                                            New
                                        </button>
                                        <button type="submit" className="win-button">
                                            Audio
                                        </button>
                                    </div>
                                </div>
                                <div className="xs-col-1-1">
                                    <label>
                                        Enter the characteres you see
                                    </label>
                                    <input 
                                        name="captcha"
                                        className="win-textbox" 
                                        id="captcha" 
                                        value={this.state.captcha} 
                                        onChange={this.changeInput} 
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="captcha" 
                                        value={this.state.captcha} 
                                        captcha="captcha"
                                        showErrors={this.state.showErrors}
                                    />
                                </div>
                                <div className="xs-col-1-8">
                                    <ReactWinJS.ToggleSwitch
                                        checked={this.state.toggleSelected}
                                        labelOn=""
                                        labelOff="" 
                                    />
                                </div>
                                <div className="xs-col-7-8 check">
                                    <label> Suscribe to the Flyve MDM newsletter.</label><br />
                                    <label> You can unsuscribe at any time.</label>
                                </div>
                                <div className="xs-col-1-1">
                                    <p className="centerText">
                                        Create account means that you agree the <br />
                                        <a> Flyve MDM Services Agreement </a> and the <br />
                                        <a> privacy statement </a>
                                    </p>
                                    {this.state.message}
                                    <div className="centerContent">
                                        <button 
                                            type="submit" 
                                            className={this.state.classButton}
                                            disabled={this.state.disabledButton}
                                        >
                                            Create account
                                        </button>
                                    </div>
                                </div>
                            </form>
                            {this.state.loading}
                        </div>
                        <div className="xs-col-1-1">
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
)(CreateAccount)