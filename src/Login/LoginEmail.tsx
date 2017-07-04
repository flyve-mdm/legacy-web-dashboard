import * as React from 'react'
import Loading from '../GenericComponents/Loading'
import GetCredentials from '../Utils/GetCredentials'

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

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (re.test(this.props.email)) {
            this.props.changeValue('phase', 2)
        } else {
            this.setState({
                            classInput: 'color-line-alert',
                            errorMessage: <p className="color-type-alert"> 
                                            <span> The email entered is not registered. Try a different account or </span> 
                                            <a href="#">create an new</a>
                                        </p>
                        })
        }
    }

    render () {
    
        return (
            <div className="emailSection">
                <h1>Sign in</h1>
                <span>Use your Flyve account.</span>
                <br />		
                <a href="https://flyve-mdm.com/"> What's this? </a>	
                {this.state.errorMessage}
                <form onSubmit={this.LogInServer}>
                    <input 
                        type="email" 
                        name="email"
                        className={this.state.classInput} 
                        placeholder="Your Email Registered"
                        value={this.props.email} 
                        onChange={this.ChangeInput} 
                        required={true}
                    />
                    <button className="win-button color-accent">Next</button>
                </form>
                <p>No account? <a href="#">Create one!</a></p>
            </div>
            
        )
    }
}