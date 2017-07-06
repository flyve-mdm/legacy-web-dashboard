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
           
        }
    }

    render () {
        return (
            <div >
                <div className="centerText" >
                    <LogoFlyve />
                    <div>
                        <h1>
                            Verify your identify
                        </h1>
                        <p>it's easy, just click the button below</p>
                       <form>
                            <input 
                                type="email" 
                                name="email"
                                className="win-textbox"
                                value="example@teclib.com" 
                                disabled={true}
                            />
                            <button className="win-button color-accent color-type-primary-alt">Validate</button>
                        </form>
                        {this.props.loading}
                    </div>
                    <Credentials />
                </div>
            </div>
            
        )
    }
}