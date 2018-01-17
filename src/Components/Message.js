import React from 'react';

class Message extends React.Component {
    render(){
        return(
            <div>
                <span className="message-item"><span className="username">{ this.props.username } :</span> <span className="message">{ this.props.message }</span></span>
            </div>
        )
    }
}

export default Message;