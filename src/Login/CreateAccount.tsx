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

export default class CreateAccount extends React.Component<any, any> {
    
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
            showErrors: false,
            suscribe: true
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
                                realname: this.props.lastName
                            }
                        }
                    }) 
                        .then((response2) => {
                            console.log(response2)
                            // this.props.changeLoading('')
                            // ChangeSessionToken(response.data.session_token)
                            // VerifyAccountActivation(this.props.history, 'users')
                        })
                        .catch((error) => {
                            console.log(error.response)
                            // this.props.changeLoading('')
                        })
                })
            
        }
    }

    render () {
        return (
            <div>
                <div className="LoginForm" id="createAccount">
                    <LogoFlyve />
                    <div>
                        <div className="centerText title"> 
                            <h1>
                                Create an account
                            </h1>
                            <a href="login">Sign in</a>
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
                                    required={true}
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
                                    required={true} 
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
                                    className="win-textbox" 
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
                                <div className="centerContent">
                                    <button type="submit" className="win-button color-accent color-type-primary-alt">
                                        Create account
                                    </button>
                                </div>
                            </div>
                        </form>
                        {this.props.loading}
                    </div>
                    <div className="xs-col-1-1">
                        <Credentials />
                    </div>
                </div>
            </div>
            
        )
    }
}