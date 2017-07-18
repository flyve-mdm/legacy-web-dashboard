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

class EditEmailAddress extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
            userName: '',
            password: '',
            loading: <span />,
            disabledButton: false,
            classButton: 'win-button color-accent color-type-primary-alt'
        }
    }

    changeInput = (input) => {
        this.setState({[input.target.name]: input.target.value})
    }

    validateAndSend = (e) => {
        e.preventDefault()
        
        let DATA_FORM = {
            userName: this.state.userName,
            password: this.state.password
        }

        let validForm = true

        for (let prop in DATA_FORM) {
            if (DATA_FORM[prop] === '') {
                validForm = false
            } 
        }

        // tslint:disable-next-line:max-line-length
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(this.state.userName)) {
            validForm = false
        } 
        if (this.state.password.length < 8 ) {
            validForm = false
        }
        if (validForm) {
            this.setState({
                loading: <Loading className="loagind-form color-bg-light-vivid-mid"/>,
                disabledButton: true,
                classButton: 'win-button'
            })
            axios.post ('https://dev.flyve.org/glpi/apirest.php/', {
                    // login: config.userAdminName,
                    // password: config.userAdminPassword
                }) 
                    .then((response) => {
                        console.log(response)
                        this.setState({
                            loading: <span/>,
                            disabledButton: false,
                            classButton: 'win-button color-accent color-type-primary-alt'
                        })
                        this.props.history.push('/verifyyouremail')
                    }) 
                    .catch((error) => {
                        console.log(error.response)
                        this.setState({
                            loading: <span/>,
                            disabledButton: false,
                            classButton: 'win-button color-accent color-type-primary-alt',
                            padding: <div className="color-type-alert">{error.response.data[1]}</div> 
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
                    <div id="EditEmailAddress">
                        <LogoFlyve history={this.props.history}/>
                        <div className="enterContentAnimation">
                            <div className="centerText title"> 
                                <h1>
                                    Edit email addres
                                </h1>
                            </div>
                            <form onSubmit={this.validateAndSend}>
                                <div className="xs-col-1-1">
                                    <label>New email addres</label>
                                    <input 
                                        name="userName"
                                        className="win-textbox" 
                                        id="userName" 
                                        value={this.state.userName} 
                                        onChange={this.changeInput} 
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="userName" 
                                        value={this.state.userName} 
                                    />
                                </div>
                                <div className="xs-col-1-1">
                                    <label>Current password</label>
                                    <input 
                                        name="password"
                                        className="win-textbox" 
                                        id="password" 
                                        value={this.state.password} 
                                        type="password" 
                                        onChange={this.changeInput} 
                                        required={true} 
                                    />
                                    <ErrorInput 
                                        name="password" 
                                        value={this.state.password} 
                                    />
                                    <label className="color-type-secondary">
                                        Confirm your Flyve MDM account password so we can be sure it's you  
                                    </label>
                                    <p />
                                </div>
                                <div className="xs-col-1-2">
                                    <button 
                                        className="win-button" 
                                        onClick={() => this.props.history.push('/verifyyouremail')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className="xs-col-1-2">
                                    <button 
                                        type="submit" 
                                        className={this.state.classButton}
                                        disabled={this.state.disabledButton}
                                    >
                                        Save email
                                    </button>
                                </div>
                            </form>
                            <div className="xs-col-1-1">
                            
                            {this.state.loading}
                            </div>
                        
                        </div>
                    </div>
                </div>
                <Credentials />
            </div>
        )
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(EditEmailAddress)