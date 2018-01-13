import React from 'react';
import { Link } from 'react-router-dom';
import Message from './Message';

class Channel extends React.Component {

    componentWillMount(){
        console.log('Channel mounted!')
        this.props.clearMessageList;
    }
    componentDidMount(){
        this.props.socket.emit('connect_message', { channel: this.props.channel, message: 'Hello world!'});
    }

    render(){
        return(
            <div className="main-panel container-fluid">
                <header>
                    <div className="row">
                        <div className="channel-header col-6 no-gutter">
                            <span className="channel-header-name"><img className="channel-image rounded" src="" />{ this.props.name }</span>
                        </div>
                        <div className="channel-header col-6 no-gutter">
                            <span className="channel-header-title">{ this.props.title }</span><Link to={'/chezoirdate'}>Aller chez Oirdate</Link>
                        </div>
                    </div>
                </header>
                <div className="row">
                    <div className="col-6">
                        <section>
                            <div className="embed-flux embed-responsive embed-responsive-16by9">
                                <iframe id="player" className="embed-responsive-item" type="text/html"
                                        src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1"></iframe>
                            </div>
                            <br />
                            { this.props.description }
                        </section>
                    </div>
                    <div className="col-6">
                        <aside>
                            <div className="chat-box">
                                { this.props.messageList.map( (message, index) =>
                                    <Message    key={index}
                                                username={message.username}
                                                message={message.message} />
                                )}
                            </div>
                            <div className="chat-entry form-group">
                                <input id="chat-input" type="text" className="form-control" onChange={this.props.updateChatInput.bind(this)} onKeyPress={this.props.sendMessage.bind(this)}/>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        )
    }
}

export default Channel;


