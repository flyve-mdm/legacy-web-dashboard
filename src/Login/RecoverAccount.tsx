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

export default class CreateAccount extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
           userName: '',
           captcha: ''
        }
    }

    changeInput = (input) => {
        this.setState({[input.target.name]: input.target.value})
    }

    render () {
        return (
            <div className="LoginForm">
                <div id="maincontent">
                    <div id="RecoverAccount">
                        <LogoFlyve />
                        <div>
                            <div className="centerText" >
                                <h1>
                                    Recover your <br />
                                    account
                                </h1>
                                <p>
                                    We can help you reset your password and security info. First, 
                                    enter Flyve MDM account and follow the instructions below.
                                </p>
                            </div>
                            
                            <form>
                                <div className="xs-col-1-1">
                                    <input 
                                        type="email" 
                                        name="userName"
                                        id="userName"
                                        className="win-textbox"
                                        placeholder="example@teclib.com"
                                        onChange={this.changeInput}
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="userName" 
                                        value={this.state.userName} 
                                        showErrors={true}
                                    />
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
                                    <input 
                                        className="win-textbox" 
                                        id="captcha"
                                        placeholder="Enter the characteres you see"
                                        onChange={this.changeInput}
                                    />
                                    <ErrorInput 
                                        name="captcha" 
                                        value={this.state.userName} 
                                        showErrors={true}
                                    />
                                    <p />
                                </div>
                                <div className="xs-col-1-2 ">
                                    <button className="win-button" type="reset">
                                        Cancel
                                    </button>
                                </div>
                                <div className="xs-col-1-2 ">
                                    <button type="submit" className="win-button color-accent color-type-primary-alt">
                                        Next
                                    </button>
                                </div>
                            </form>
                            {this.props.loading}
                        </div>
                        <Credentials />
                    </div>
                </div>
            </div>
        )
    }
}