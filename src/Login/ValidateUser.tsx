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
import { bindActionCreators } from 'redux'
import { changeValue } from './DuckController'
import { connect } from 'react-redux'
let WinJS = require('winjs')    
import { Link } from 'react-router-dom'

function mapStateToProps(state, props) {
    return {
        userName: state.Login.userName
    }
}

function mapDispatchToProps(dispatch) {
    const actions = {
        changeValue: bindActionCreators(changeValue, dispatch)
    }
    return { actions }
}

class ValidateUser extends React.Component<any, any> {
    
    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
           userName: 'gianfrancomanganiello1997@gmail.com',
           classButton: 'win-button color-accent color-type-primary-alt',
           disabledButton: false,
           loading: <span />,
           componentLoaded: false,
           padding: <span />,
           animate: true
        }
    }

    componentWillMount () {
        
        const ACTIVE = 'registered Flyve MDM users. Created by Flyve MDM - do NOT modify this comment.'
        axios({
            method: 'get',
            url: 'https://dev.flyve.org/glpi/apirest.php/getActiveProfile/'
        })
            .then((response) => {
                if (response.data.active_profile.comment !== ACTIVE) {
                    this.setState({
                        componentLoaded: true,
                    })
                } else {
                    this.setState({
                        componentLoaded: true,
                        classButton: 'win-button',
                        disabledButton: true,
                        // tslint:disable-next-line:jsx-wrap-multiline
                        padding: <div>
                                    <strong>Account already activated</strong><br/>
                                    <Link to="/login">Sign in</Link>
                                 </div>
                    })
                }
            })
            .catch(() => {
                this.setState({
                        componentLoaded: true
                    })
            })
    }

    validate () {
        this.setState({
            loading: <Loading className="loagind-form color-bg-light-vivid-mid"/>,
            disabledButton: true,
            classButton: 'win-button',
            padding: <span />
        })
        axios.post ('https://dev.flyve.org/glpi/apirest.php/', {
                // login: config.userAdminName,
                // password: config.userAdminPassword
            }) 
                .then((response) => {
                    console.log(response)
                    this.setState({
                        loading: <span/>
                    })
                    // tslint:disable-next-line:jsx-wrap-multiline
                    this.props.actions.changeValue('messageSignIn', <div>
                                                                        <span>Account activated!</span> 
                                                                        <br />		
                                                                        <span>Now you can sign in.</span>
                                                                    </div>
                    )
                    this.props.actions.changeValue('userName', this.state.userName)
                    this.props.history.push('/login')
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

    componentDidUpdate () {
        if (this.state.animate) {
            WinJS.UI.Animation.enterContent(
                document.querySelector('.enterContentAnimation'), 
                { top: '0px', left: '200px' },
                {
                    mechanism: 'transition'
                }
            )
            this.setState({
                animate: false
            })
        }
    }

    render () {
        if (!this.state.componentLoaded) {
            return <Loading />
        } else {
            return (
                <div className="LoginForm">
                    <div id="maincontent">
                        <div className="centerText" id="validateUser">
                            <LogoFlyve history={this.props.history}/>
                            <div className="enterContentAnimation">
                                <h1>
                                    Verify your identity
                                </h1>
                                <p>
                                    it's easy, just click the button below
                                </p>
                            <form>
                                    <input 
                                        type="email" 
                                        className="win-textbox color-type-disabled"
                                        value={this.state.userName} 
                                        disabled={true}
                                    />
                                    <button 
                                        className={this.state.classButton}
                                        type="button"
                                        disabled={this.state.disabledButton}
                                        onClick={() => this.validate()} 
                                    >
                                        Validate
                                    </button>
                                    {this.state.padding}
                                </form>
                                {this.state.loading}
                            </div>
                        </div>
                    </div>
                    <Credentials />
                </div>
            )
        }
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(ValidateUser)