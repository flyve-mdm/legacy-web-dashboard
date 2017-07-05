import * as React from 'react'

export default class ErrorInput extends React.Component<any, any> {
    render() {
        console.log(this.props.name)
        console.log(this.props.value)
        let message = ''
        if (this.props.value === '') {
            message = 'Required field'
        } else if (this.props.name === 'userName') {
            // tslint:disable-next-line:max-line-length
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!re.test(this.props.value)) {
                message = 'Invalid email'
            } 
        } else if (this.props.name === 'password') {
            if (this.props.value.length < 8 ) {
                message = 'The password must be at least 8 characters'
            }
        } else if (this.props.name === 'reenterPassword') {
            if (this.props.value !== this.props.password) {
                message = 'Passwords do not match'
            }
        }
        return <label className="color-type-alert">{message}</label>
    }
}
