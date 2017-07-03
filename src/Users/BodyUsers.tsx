import * as React from 'react'
import ReactWinJS = require ('react-winjs') 
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closePane, changeLocation, changePeople } from './DuckController'
import PeoplePage from './PeoplePage'
import CloseSession from '../Utils/CloseSession'

function mapStateToProps(state, props) {
  return {
    splitViewId: state.Users.splitViewId,
    paneOpened: state.Users.paneOpened,
    location: state.Users.location,
    splitViewConfigs: state.Users.splitViewConfigs,
    mode: state.Users.mode,
    people: state.Users.people
  }
}

function mapDispatchToProps(dispatch) {
  const actions = {
    closePane: bindActionCreators(closePane, dispatch),
    changeLocation: bindActionCreators(changeLocation, dispatch)
  }
  return { actions }
}

class BodyUsers extends React.Component<any, any> {
    
    handleCommandInvoked (newLocation) {
        this.props.actions.changeLocation(newLocation)
        this.props.actions.closePane()
    }

    render () {
        let contentComponent
        if (this.props.location[0] === 'people') {
            contentComponent = <PeoplePage 
                                    mode={this.props.mode} 
                                    location={this.props.location} 
                                    people={this.props.people} 
                                    onNavigate={this.props.actions.changeLocation} 
                                    changePeople={this.props.actions.changePeople} 
                               />
        } else {
            contentComponent = <h2 className="win-h2" style={{marginLeft: '10px'}}> {this.props.location} </h2>
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
                    onInvoked={() => CloseSession(this.props.history)}
                />

            </div>
        )

        return (
            <ReactWinJS.SplitView
                id={this.props.splitViewId}
                paneComponent={pane}
                style={{height: 'calc(100% - 48px)'}}
                contentComponent={contentComponent}
                paneOpened={this.props.paneOpened}
                onAfterClose={this.props.actions.closePane}
                {...this.props.splitViewConfigs[this.props.mode]} 
            />
        )
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(BodyUsers)