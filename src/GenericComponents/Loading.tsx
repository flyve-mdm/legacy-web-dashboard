import * as React from 'react'
import './Loading.css'

export default class Login extends React.Component<any, any> {
    render () {
        let className = 'loading'
        if (this.props.className) {
            className = `loading ${this.props.className}`
        }
        return (
            <div className={className}> 
                <div className="vuload">
                    <div className="vuitems" id="vuitems_1">
                        <div className="comp"/>
                    </div>
                    <div className="vuitems" id="vuitems_2">
                        <div className="comp"/>
                    </div>
                    <div className="vuitems" id="vuitems_3">
                        <div className="comp"/>
                    </div>
                    <div className="vuitems" id="vuitems_4">
                        <div className="comp"/>
                    </div>
                    <div className="vuitems" id="vuitems_5">
                        <div className="comp"/>
                    </div>
                </div>
            </div>
        )
    }
}