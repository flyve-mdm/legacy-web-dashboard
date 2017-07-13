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
let ReactWinJS = require('react-winjs')
import { bindActionCreators } from 'redux'
import { changeValue } from './DuckController'
import { connect } from 'react-redux'
let WinJS = require('winjs')    

function mapStateToProps(state, props) {
    return {}
}

function mapDispatchToProps(dispatch) {
    const actions = {
        changeValue: bindActionCreators(changeValue, dispatch)
    }
    return { actions }
}

class CreateAccount extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
            password: '',
            reenterPassword: '',
            showErrors: false,
            loading: <span />,
            disabledButton: false,
            classButton: 'win-button color-accent color-type-primary-alt'
        }
    }

    changeInput = (input) => {
        this.setState({[input.target.name]: input.target.value})
    }

    changeShowErrors = () => {
        this.setState({showErrors: true})
    }

    validateAndSend = (e) => {
        e.preventDefault()

        this.changeShowErrors()
        let DATA_FORM = {
            password: this.state.password,
            reenterPassword: this.state.reenterPassword
        }

        let validForm = true

        for (let prop in DATA_FORM) {
            if (DATA_FORM[prop] === '') {
                validForm = false
            } 
        }

        if (this.state.password.length < 8 ) {
            validForm = false
        }
        if (this.state.password !== this.state.reenterPassword) {
            validForm = false
        }
        if (validForm) {
            this.setState({
                loading: <Loading className="loagind-form color-bg-light-vivid-mid"/>,
                disabledButton: true,
                classButton: 'win-button'
            })
            axios.post ('https://dev.flyve.org/glpi/apirest.php/initSession', {
                login: config.userAdminName,
                password: config.userAdminPassword
            }) 
                .then((response) => {
                    console.log(response)
                    axios({
                        method: 'post',
                        url: 'https://dev.flyve.org/glpi/apirest.php/User',
                        headers: {
                            'Session-Token': response.data.session_token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            input: {
                                password: this.props.password,
                                password2: this.props.reenterPassword
                            }
                        }
                    }) 
                        .then((response2) => {
                            console.log(response2)
                            this.props.actions.changeValue('userName', this.state.userName)
                            let Jfake = {
                                // tslint:disable-next-line:max-line-length
                                massage: 'An entity already exists for your email. You probably already have an account.'
                            }
                            this.setState({
                                loading: <span />,
                                classButton: 'win-button color-accent color-type-primary-alt',
                                disabledButton: false
                                // disabledButton: false
                            })
                            this.props.history.push('/validateuser')
                        })
                        .catch((error) => {
                            console.log(error)
                            this.props.actions.changeValue('userName', this.state.userName)
                            let Jfake = {
                                // tslint:disable-next-line:max-line-length
                                massage: 'An entity already exists for your email. You probably already have an account.'
                            }
                            this.setState({
                                loading: <span />,
                                classButton: 'win-button color-accent color-type-primary-alt',
                                disabledButton: false
                                // message: <p className="color-type-alert">{Jfake.massage}</p>
                            })
                            this.props.history.push('/validateuser')
                        })
                })
        }
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
            <div className="LoginForm">                
                <div id="maincontent">
                    <div id="createAccount">
                        <LogoFlyve />
                        <div className="enterContentAnimation">
                            <div className="centerText title"> 
                                <h1>
                                    Recover your <br />
                                    account
                                </h1>
                            </div>
                            <form onSubmit={this.validateAndSend}>
                                <div className="xs-col-1-1">
                                    <label>Password</label>
                                    <input 
                                        name="password"
                                        className="win-textbox" 
                                        id="password" 
                                        value={this.state.password} 
                                        type="password" 
                                        onChange={this.changeInput} 
                                        placeholder="Enter password"
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="password" 
                                        value={this.state.password} 
                                        showErrors={this.state.showErrors}
                                    />
                                </div>
                                <div className="xs-col-1-1">
                                    <label>Reenter Password</label>
                                    <input 
                                        name="reenterPassword"
                                        className="win-textbox" 
                                        id="reenterPassword" 
                                        value={this.state.reenterPassword} 
                                        type="password" 
                                        onChange={this.changeInput} 
                                        placeholder="Enter password"
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="reenterPassword" 
                                        value={this.state.reenterPassword} 
                                        password={this.state.password} 
                                        showErrors={this.state.showErrors}
                                    />
                                    <label className="color-type-secondary">
                                        8-character minimun; case sensitive   
                                    </label>
                                    <p />
                                    <div className="centerContent">
                                        <button 
                                            type="submit" 
                                            className={this.state.classButton}
                                            disabled={this.state.disabledButton}
                                        >
                                            Create account
                                        </button>
                                    </div>
                                </div>
                            </form>
                            {this.state.loading}
                        </div>
                        <div className="xs-col-1-1">
                            <Credentials />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount)