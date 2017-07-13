import * as React from 'react'
import LogoFlyve from './LogoFlyve'
import Credentials from './Credentials'
let WinJS = require('winjs')    

export default class RevokeInvitationSuccess extends React.Component<any, any> {

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
                    <div className="centerText">
                        <LogoFlyve />
                        <div className="enterContentAnimation">
                            <h1>
                                Recover your <br />
                                account
                            </h1>
                            <p>
                                To reset your password, open your mailbox <br/>
                                and find the email with the subject "Reser <br/>
                                password" and open the link to create <br/>
                                a new password
                            </p>
                            <Credentials />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}