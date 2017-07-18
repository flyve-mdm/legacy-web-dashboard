import * as React from 'react'
import { Link } from 'react-router-dom'

export default class LogoFlyve extends React.Component<any, any> {
    render() {
        return (
            <div className="centerContent">
                <img 
                    src="img/logo-flyve.svg" 
                    className="img-login" 
                    onClick={() => this.props.history.push('login')}
                />
            </div>
        )
    }
}