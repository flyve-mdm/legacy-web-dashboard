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
let WinJS = require('winjs')    
import { bindActionCreators } from 'redux'
import { changeLoading, changeValue } from './DuckController'
import { connect } from 'react-redux'

function mapStateToProps(state, props) {
    return {
        userName: state.Login.userName
    }
}

function mapDispatchToProps(dispatch) {
    const actions = {}
    return { actions }
}

class RecoverAccount extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        console.log(this.props.userName)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
            classButton: 'win-button color-accent color-type-primary-alt',
            userName: this.props.userName,
            captcha: '',
            showErrors: false,
            loading: <span />
        }
    }

    recover = (e) => {
        e.preventDefault()
        this.setState({
            classButton: 'win-button',
            showErrors: true
        })
        let validForm = true

        let DATA_FORM = {
            userName: this.state.userName,
            captcha: this.state.suscribe
        }

        for (let prop in DATA_FORM) {
            if (DATA_FORM[prop] === '') {
                validForm = false
            } 
        }
        // tslint:disable-next-line:max-line-length
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(DATA_FORM.userName)) {
            validForm = false
        } 

        if (validForm) { 
            this.setState({
                loading: <Loading className="loagind-form color-bg-light-vivid-mid"/>
            })
            axios.post ('https://dev.flyve.org/glpi/apirest.php/', {
                // login: config.userAdminName,
                // password: config.userAdminPassword
            }) 
                .then((response) => {
                    console.log(response)
                    this.setState({
                        loading: <span/>,
                        classButton: 'win-button color-accent color-type-primary-alt'
                    })
                    // this.props.actions.changeValue('userName', this.state.userName)
                    this.props.history.push('/recoveraccountsuccess')
                }) 
                .catch((error) => {
                    console.log(error.response)
                    this.setState({
                        loading: <span/>,
                        classButton: 'win-button color-accent color-type-primary-alt'
                    })
                    // this.props.actions.changeValue('userName', this.state.userName)
                    this.props.history.push('/recoveraccountsuccess')
                    // this.props.changeLoading('')
                })
        }
        
    }

    changeInput = (input) => {
        this.setState({[input.target.name]: input.target.value})
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
                    <div id="RecoverAccount">
                        <LogoFlyve />
                        <div className="enterContentAnimation">
                            <div className="centerText" >
                                <h1>
                                    Recover your <br />
                                    account
                                </h1>
                                <p>
                                    We can help you reset your password and security info. First, 
                                    enter Flyve MDM account and follow the instructions below.
                                </p>
                            </div>
                            
                            <form onSubmit={this.recover}>
                                <div className="xs-col-1-1">
                                    <input 
                                        type="email" 
                                        name="userName"
                                        id="userName"
                                        className="win-textbox"
                                        placeholder="example@teclib.com"
                                        onChange={this.changeInput}
                                        value={this.state.userName}
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="userName" 
                                        value={this.state.userName} 
                                        showErrors={this.state.showErrors}
                                    />
                                </div>
                                <div className="captcha">
                                    <div className="xs-col-1-2 ">
                                        <div className="color-bg-dark-vivid-high centerText centerContent">
                                            <p className="color-type-primary-alt">
                                                CAPTCHA
                                            </p>
                                        </div>
                                    </div>
                                    <div className="xs-col-1-2 ">
                                        <button type="submit" className="win-button">
                                            New
                                        </button>
                                        <button type="submit" className="win-button">
                                            Audio
                                        </button>
                                    </div>
                                </div>
                                <div className="xs-col-1-1">
                                    <input 
                                        name="captcha"
                                        className="win-textbox" 
                                        id="captcha" 
                                        value={this.state.captcha} 
                                        onChange={this.changeInput} 
                                        required={true} 
                                        placeholder="Enter the characteres you see"
                                    />
                                    <p />
                                </div>
                                <div className="xs-col-1-2 ">
                                    <button className="win-button" type="reset">
                                        Cancel
                                    </button>
                                </div>
                                <div className="xs-col-1-2 ">
                                    <button 
                                        type="submit" 
                                        className={this.state.classButton}
                                    >
                                        Next
                                    </button>
                                </div>
                            </form>
                            {this.state.loading}
                        </div>
                        <Credentials />
                    </div>
                </div>
            </div>
        )
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(RecoverAccount)