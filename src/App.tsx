import * as React from 'react'
import Loading from './GenericComponents/Loading'
import VerifyAccountActivation from './Utils/VerifyAccountActivation'
import { bindActionCreators } from 'redux'
import { changeValue } from './Login/DuckController'
import { connect } from 'react-redux'

function mapStateToProps(state, props) {
    return {}
}

function mapDispatchToProps(dispatch) {
    const actions = {
        changeValue: bindActionCreators(changeValue, dispatch)
    }
    return { actions }
}

class App extends React.Component<any, any> {

    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-mid'
        this.props.actions.changeValue('animate', false)
        VerifyAccountActivation(this.props.history, 'users')
    }

    render () {
        return <Loading />
    }
}
export default connect <any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(App)
