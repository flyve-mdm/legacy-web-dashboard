import * as React from 'react'
import Loading from '../GenericComponents/Loading'
let GetCredentials = require('../Utils/GetCredentials')
let ReactWinJS = require('react-winjs')
import ErrorInput from './ErrorInput'
import { Link } from 'react-router-dom'
let WinJS = require('winjs')    

export default class LoginEmail extends React.Component<any, any> {

    constructor (props: void) {
        super(props)
        this.state = {
            classInput: 'win-textbox',
            errorMessage: ''
        }
        GetCredentials()
    }
    
    ChangeInput = (input) => {
        this.props.changeValue(input.target.name, input.target.value)
        this.setState({ classInput: 'win-textbox', errorMessage: '' })
    }
    
    LogInServer = (e) => {
        e.preventDefault()

        // tslint:disable-next-line:max-line-length
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (re.test(this.props.userName)) {
            this.props.changeValue('phase', 2)
        } else {
            this.setState({
                            classInput: 'win-textbox color-line-alert',
                            errorMessage: 
                                    // tslint:disable-next-line:jsx-wrap-multiline
                                    <p className="color-type-alert"> 
                                        <span> The email you entered is invalid</span>
                                    </p>
                        })
        }
    }

    handleShow = (eventObject) => {
        var anchor = eventObject.currentTarget
        let refs: any = this.refs
        refs.flyout.winControl.show(anchor)
    }

    componentDidMount () {
        if (this.props.animate) {
            WinJS.UI.Animation.enterContent(
                document.querySelector('.enterContentAnimation'), 
                { top: '0px', left: '200px' },
                {
                    mechanism: 'transition'
                }
            )
            this.props.changeValue('animate', false)
        }
    }

    render () {
        var messageSignIn = <span />
        var createAccount = <span />

        if (this.props.messageSignIn !== '') {
            messageSignIn = this.props.messageSignIn
        } else {
            messageSignIn = (
                <div>
                    <span>Use your Flyve MDM admin account.</span> <br />		
                    <a onClick={this.handleShow}> What's this? </a>	

                    <ReactWinJS.ContentDialog 
                        ref="flyout"
                        primaryCommandText="OK"
                        secondaryCommandText="Cancel"
                    >
                        <div className="flyout">
                            <h3>WHAT IS FLYVE MDM?</h3>
                            <p>
                                <strong>Flyve MDM</strong> is a mobile device management open source 
                                software (SaaS) that enables you to secure and manage all the mobile 
                                devices of your business via a unique web-based console (MDM).
                            </p>
                        </div>
                        
                    </ReactWinJS.ContentDialog>
                </div>
            )
            createAccount = <p><strong>No account?</strong> <Link to="/CreateAccount">Create one!</Link></p>
        }

        return (
            <div className="enterContentAnimation">
                <div className="centerText">
                    <h1>Sign in</h1>
                </div>
                {messageSignIn}
                
                {this.state.errorMessage}
                <form onSubmit={this.LogInServer}>
                    <input 
                        type="email" 
                        name="userName"
                        className={this.state.classInput}
                        placeholder="Enter login"
                        value={this.props.userName} 
                        onChange={this.ChangeInput} 
                        required={true}
                    />
                    <button className="win-button color-accent color-type-primary-alt">Next</button>
                </form>
                {createAccount}
            </div>
            
        )
    }
}
