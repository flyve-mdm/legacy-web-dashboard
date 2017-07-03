import * as React from 'react'
import CssUrl from '../Utils/CssUrl'

export default class ProfilePicture extends React.Component<any, any> {
    render () {
        let size = this.props.size
        return (
            <div 
                className="profilePicture" 
                style={{
                    backgroundImage: CssUrl(this.props.backgroundUrl),
                    width: size,
                    height: size,
                    WebkitBorderRadius: size,
                    MozBorderRadius: size,
                    borderRadius: size,
                    backgroundSize: 'cover',
                    display: 'inline-block'
                }}
            >
                <img src="img/profile.png" height={size} width={size} />
            </div>
        )
    }
}
