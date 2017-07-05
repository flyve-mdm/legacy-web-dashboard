import * as React from 'react'

export default class ErrorInput extends React.Component<any, any> {
    render() {
        let message = <span />
        if (this.props.value === '' || this.props.value === undefined || this.props.value === null) {
            message = <label className="color-type-alert">Required field</label>
        } else if (this.props.name === 'userName') {
            // tslint:disable-next-line:max-line-length
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!re.test(this.props.email)) {
                message = <label className="color-type-alert">Required field</label>
            } 
        } else if (this.props.name === 'password') {
            if (this.props.value.length < 8 ) {
                message = <label className="color-type-alert">The password must be at least 8 characters</label>
            }
        }
        return message
    }
}
