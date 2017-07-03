import * as React from 'react'
import VerifyAccountActivation from '../Utils/VerifyAccountActivation'
import Loading from '../GenericComponents/Loading'
import './ContactBook.css'

import HeaderContactBook from './HeaderContactBook'
import BodyContactBook from './BodyContactBook'

export default class ContactBook extends React.Component<any, any> {

    static propTypes = {
        history: React.PropTypes.object.isRequired
    }

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-mid'
        this.state = {
            renderedComponent: <Loading />
        }
    }

    componentWillMount () {
        VerifyAccountActivation(this.props.history)
            .then((active) => {
                if (active) {
                    this.setState({renderedComponent: <div style={{height: '100%'}}>
                                                          <HeaderContactBook />
                                                          <BodyContactBook history={this.props.history}/>
                                                      </div>
                    })
                } 
            })
    }

    render () {
        return this.state.renderedComponent
    }
}