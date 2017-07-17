import * as React from 'react'
import axios from 'axios'
import Loading from '../GenericComponents/Loading'
import ChangeSessionToken from '../Utils/ChangeSessionToken'
import VerifyAccountActivation from '../Utils/VerifyAccountActivation'
let SaveCredentials = require('../Utils/SaveCredentials')
let ReactWinJS = require('react-winjs')
let WinJS = require('winjs')    
import { Link } from 'react-router-dom'

export default class LoginEmail extends React.Component<any, any> {
    
    constructor (props: void) {
        super(props)
        this.state = {
            classInput: 'win-textbox',
            errorMessage: ''
        }
    }

    ChangeInput = (input) => {
        this.props.changeValue(input.target.name, input.target.value)
        this.setState({ classInput: 'win-textbox' })
    }
    
    LogInServer = (e) => {
        e.preventDefault()

        this.props.changeLoading(<Loading className="loagind-form color-bg-light-vivid-mid"/>)

        axios.post ('https://dev.flyve.org/glpi/apirest.php/initSession', {
                login: this.props.userName,
                password: this.props.password
        })  
            .then((response) => {
                this.props.changeLoading('')
                ChangeSessionToken(response.data.session_token)
                
                SaveCredentials(this.props.userName, this.props.password, () => {
                    VerifyAccountActivation(this.props.history, 'users')
                })
                
            })
            .catch((error) => {
                this.props.changeLoading('')
                this.setState({
                        classInput: 'win-textbox color-line-alert',
                        errorMessage: 
                                    // tslint:disable-next-line:jsx-wrap-multiline
                                    <p className="color-type-alert"> 
                                        Your account or password is incorrect. If you don't remember your password, 
                                        <a href="#"> reset it now.</a>
                                    </p>
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
            <div className="enterContentAnimation">
                <h1>Enter password</h1>
                <span>Enter the password for</span>	<br />
                <span>{this.props.userName}</span>	
                {this.state.errorMessage}
                <form onSubmit={this.LogInServer}>
                    <div className="xs-col-1-1">
                        <input 
                            type="password" 
                            name="password" 
                            className={this.state.classInput}
                            placeholder="Password"
                            value={this.props.password} 
                            onChange={this.ChangeInput} 
                            required={true}
                        />
                    </div>
                    <div className="checkSignIn hide">
                        <div className="xs-col-1-8">
                            <ReactWinJS.ToggleSwitch
                                checked={this.state.toggleSelected}
                                labelOn=""
                                labelOff="" 
                            />
                        </div>
                        <div className="xs-col-7-8 check">
                            <label>Keep me signed in</label>
                        </div>
                    </div>
                    <div className="xs-col-1-2 ">
                        <button className="win-button" type="button" onClick={() => this.props.changeValue('phase', 1)}>
                            Back 
                        </button>
                    </div>
                    <div className="xs-col-1-2 ">
                        <button type="submit" className="win-button color-accent color-type-primary-alt">
                            Sing in
                        </button>
                    </div>
                    <div className="xs-col-1-1">
                        <p><Link to="/recoveraccount">Forgot my password</Link></p>
                    </div>
                    
                </form>
            </div>
            
        )
    }
}