import * as React from 'react'
import Loading from './GenericComponents/Loading'
import VerifyAccountActivation from './Utils/VerifyAccountActivation'

export default class App extends React.Component<any, any> {

    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-mid'
        VerifyAccountActivation(this.props.history, 'users')
    }

    render () {
        return <Loading />
    }
}
