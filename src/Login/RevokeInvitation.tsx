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

export default class RevokeInvitation extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
            classButton: 'win-button color-accent color-type-primary-alt',
            // tslint:disable-next-line:jsx-wrap-multiline
            padding: 'Someone might have just mistyped their email address and accidentally tried to add yours.'
        }
    }

    Revoke () {
        axios.post ('https://dev.flyve.org/glpi/apirest.php/', {
                // login: config.userAdminName,
                // password: config.userAdminPassword
            }) 
                .then((response) => {
                    console.log(response)
                    this.setState({
                        classButton: 'win-button',
                        padding: 'Email already unsubscribed'
                    })
                }) 
                .catch((error) => {
                    console.log(error.response)
                    // this.props.changeLoading('')
                })
    }

    render () {
        return (
            <div className="LoginForm">
                <div id="maincontent">
                    <div className="centerText" id="validateUser">
                        <LogoFlyve />
                        <div>
                            <h1>
                                Revoke invitation
                            </h1>
                            <p>We apologize for any inconveniences</p>
                        <form>
                                <input 
                                    type="email" 
                                    name="email"
                                    className="win-textbox"
                                    value="example@teclib.com" 
                                    disabled={true}
                                />
                                <button className={this.state.classButton} type="button" onClick={() => this.Revoke()}>
                                    Opt-out
                                </button>
                                <p>
                                   {this.state.padding} 
                                </p>
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