import * as React from 'react'
import ReactWinJS = require ('react-winjs') 
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closePane, changeLocation, changePeople, uploadUsers } from './DuckController'
import PeoplePage from './PeoplePage'
import CloseSession from '../Utils/CloseSession'
import Loading from '../GenericComponents/Loading'

import GetAllUsers from '../Utils/GetAllUsers'
import InitialPeople from './InitialPeople'

function mapStateToProps(state, props) {
  return {
    splitViewId: state.Users.splitViewId,
    paneOpened: state.Users.paneOpened,
    location: state.Users.location,
    splitViewConfigs: state.Users.splitViewConfigs,
    mode: state.Users.mode,
    people: state.Users.people,
    users: state.Users.users
  }
}

function mapDispatchToProps(dispatch) {
  const actions = {
    closePane: bindActionCreators(closePane, dispatch),
    changeLocation: bindActionCreators(changeLocation, dispatch),
    uploadUsers: bindActionCreators(uploadUsers, dispatch)
  }
  return { actions }
}

class BodyUsers extends React.Component<any, any> {

    constructor (props: void) {
        super(props)
        this.state = {
            renderedComponent: <Loading />
        }
    }
    bodyRender(props) {
        let contentComponent
        if (props.location) {
            if (props.location[0] === 'people') {
                contentComponent = <PeoplePage 
                                        mode={props.mode} 
                                        location={props.location} 
                                        people={props.people} 
                                        onNavigate={props.actions.changeLocation} 
                                        changePeople={props.actions.changePeople} 
                                   />
            } else {
                contentComponent = <h2 className="win-h2" style={{marginLeft: '10px'}}> {props.location} </h2>
            }
        } 

        let pane = (
            <div>
                <ReactWinJS.SplitView.Command
                    label="People"
                    icon="contact"
                    onInvoked={() => this.handleCommandInvoked(['people'])}
                />
                <ReactWinJS.SplitView.Command
                    label="What's New"
                    icon="comment"
                    onInvoked={() => this.handleCommandInvoked(['What\'s New'])}
                />
                <ReactWinJS.SplitView.Command
                    label="Groups"
                    icon="people"
                    onInvoked={() => this.handleCommandInvoked(['Groups'])}
                />

                <ReactWinJS.SplitView.Command
                    label="Settings"
                    icon="settings"
                    style={{position: 'absolute', bottom: 48, width: '100%'}}
                    onInvoked={() => this.handleCommandInvoked(['Settings'])}
                />

                <ReactWinJS.SplitView.Command
                    label="Close session"
                    icon="cancel"
                    style={{position: 'absolute', bottom: 0, width: '100%'}}
                    onInvoked={() => CloseSession(props.history)}
                />

            </div>
        )

        this.setState({ 
            renderedComponent: 
                <ReactWinJS.SplitView
                    id={props.splitViewId}
                    paneComponent={pane}
                    style={{height: 'calc(100% - 48px)'}}
                    contentComponent={contentComponent}
                    paneOpened={props.paneOpened}
                    onAfterClose={props.actions.closePane}
                    {...props.splitViewConfigs[props.mode]} 
                />
        })
    }

    componentWillMount() {
        InitialPeople()
            .then((response) => {
                console.log(response)

                console.log('=-=-=-=-=-=-=-=-=-=-=')
                console.log(this.props.actions)
                
                if (this.props.actions) {
                    this.props.actions.uploadUsers(response)
                    this.bodyRender(this)
                }
            }).catch((error) => {})
    }

    componentWillReceiveProps(newProps) {
        this.bodyRender(newProps)
    }

    handleCommandInvoked (newLocation) {
        this.props.actions.changeLocation(newLocation)
        this.props.actions.closePane()
    }

    render () {
        return this.state.renderedComponent
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(BodyUsers)