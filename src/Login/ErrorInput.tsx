import * as React from 'react'

export default class ErrorInput extends React.Component<any, any> {

    constructor (props: void) {
        super(props)
        document.body.className = 'win-type-body color-bg-light-vivid-high'
        this.state = {
            message: ''
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.value !== newProps.value) {
            let message = ''
            if (newProps.value === '') {
                message = 'Required field'
            } else if (newProps.name === 'userName') {
                // tslint:disable-next-line:max-line-length
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if (!re.test(newProps.value)) {
                    message = 'Invalid email'
                } 
            } else if (newProps.name === 'password') {
                if (newProps.value.length < 8 ) {
                    message = 'The password must be at least 8 characters'
                }
            } else if (newProps.name === 'reenterPassword') {
                if (newProps.value !== newProps.password) {
                    message = 'Passwords do not match'
                }
            } 
            this.setState({ message: message })
            
        }
    }

    render() {
        let input = document.getElementById(this.props.name)
        
        if (this.state.message !== '') {
            if (input) {
                input.className = 'win-textbox color-line-alert'
            }
        } else {
            if (input) {
                input.className = 'win-textbox'
            }
        }

        if (this.state.message === '') {
            return <span className="hide" />
        } else {
            return <label className="color-type-alert error">{this.state.message}<br /></label>
        }
    }
}