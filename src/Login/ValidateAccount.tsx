import * as React from 'react'
import './Login.css'
import axios from 'axios'
import ChangeSessionToken from '../Utils/ChangeSessionToken'

export default class ValidateAccount extends React.Component<any, any> {
    
    constructor (props) {
        super(props)
        document.body.className = 'color-accent'
    }

    goLogin = () => {
        ChangeSessionToken('')
        this.props.history.push(`/`)
    }

    render () {
    
        return (
            <div className="ms-grid" id="ValidateAccount">
                <div className="ms-row">
                    <div className="m-col-1-1 section1 color-white">
                        <img src="img/logo-flyve-login.png" className="img-login"/>
                    </div>
                    <div className="m-col-1-1 section2">
                        <h2> Your user is not yet activated, please check your email and activate your account </h2>
                        <button className="win-button color-accent" onClick={this.goLogin}>Go to login</button>
                    </div>
                </div>
                <span className="credentials" >
                    A solution powered by &nbsp; <img src="img/logo-teclib-blanc-1-2.png" />
                </span>
            </div>
        )
    }
}