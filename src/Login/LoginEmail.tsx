import * as React from 'react'
import Loading from '../GenericComponents/Loading'
import GetCredentials from '../Utils/GetCredentials'
let ReactWinJS = require('react-winjs')

export default class LoginEmail extends React.Component<any, any> {

    constructor (props: void) {
        super(props)
        this.state = {
            classInput: '',
            errorMessage: ''
        }
        GetCredentials()
    }
    
    ChangeInput = (input) => {
        this.props.changeValue(input.target.name, input.target.value)
    }
    
    LogInServer = (e) => {
        e.preventDefault()

        // tslint:disable-next-line:max-line-length
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (re.test(this.props.email)) {
            this.props.changeValue('phase', 2)
        } else {
            this.setState({
                            classInput: 'color-line-alert',
                            errorMessage: 
                                    // tslint:disable-next-line:jsx-wrap-multiline
                                    <p className="color-type-alert"> 
                                        <span> The email entered is not registered. Try a different account or </span> 
                                        <a href="#">create an new</a>
                                    </p>
                        })
        }
    }

    handleShow = (eventObject) => {
        var anchor = eventObject.currentTarget
        let refs: any = this.refs
        refs.flyout.winControl.show(anchor)
    }

    render () {
    
        return (
            <div>
                <div className="centerText">
                    <h1>Sign in</h1>
                </div>
                <span>Use your Flyve MDM admin account.</span> <br />		
                <a onClick={this.handleShow}> What's this? </a>	

                <ReactWinJS.Flyout ref="flyout">
                    <div className="flyout">
                        <h3>WHAT IS FLYVE MDM?</h3>
                        <p>
                            <strong>Flyve MDM</strong> is a mobile device management open source software (SaaS) that enables you to secure and manage all the mobile devices of your business via a unique web-based console (MDM).
                        </p>
                        <p>
                            Our solution allows you to efficiently and easily control any aspects of your Android-based mobile fleet, providing a panel of functionalities:
                        </p>
                        <ul>
                            <li>
                                 – Provided as a SaaS platform
                            </li>
                            <li>
                                 – Google independent
                            </li>
                            <li>
                                – Deploy and configure applications
                            </li>
                            <li>
                                – Deploy files
                            </li>
                            <li>
                                – Wipe a phone
                            </li>
                            <li>
                                – Work with devices running Android 4.4 or higher
                            </li>
                            <li>
                                – Simple web application user interface
                            </li>
                        </ul>
                    
                    </div>
                </ReactWinJS.Flyout>
                {this.state.errorMessage}
                <form onSubmit={this.LogInServer}>
                    <input 
                        type="email" 
                        name="email"
                        className="win-textbox"
                        placeholder="Enter login"
                        value={this.props.email} 
                        onChange={this.ChangeInput} 
                        required={true}
                    />
                    <button className="win-button color-accent color-type-primary-alt">Next</button>
                </form>
                <p><strong>No account?</strong> <a href="/CreateAccount">Create one!</a></p>
            </div>
            
        )
    }
}