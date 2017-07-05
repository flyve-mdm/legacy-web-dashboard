import * as React from 'react'

export default class ErrorInput extends React.Component<any, any> {
    render() {
        if (this.props.value === '' || this.props.value === undefined || this.props.value === null) {
            return <label className="color-type-alert">Required field</label>
        } else {
            return <span />
        }
        
    }
}
