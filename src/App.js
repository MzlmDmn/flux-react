import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import $ from 'jquery';
import logo from './logo.svg';
import './App.css';
import Message from './Components/Message';

class App extends Component {
    constructor(){
        super();
        this.state = {
            socket: io('http://flux.mzlm.be'),
            user: {
                username: 'Mazlum'
            },
            channel_info: {},
            chatInput: '',
            messageList: [],
        };
    }

    updateChatInput(e){
        this.setState({ chatInput: e.target.value});
    }

    sendMessage(e){
        if (e.key === 'Enter') {
            this.state.socket.emit('message', { from: this.state.user.username, on: this.props.match.params.channel, msg: this.state.chatInput});
            $('#chat-input').val('');
        }
    }

    componentWillMount(){
        this.setState({ channel: this.props.match.params.channel});
        this.state.socket.emit('connect_auth', { username: this.state.user.username });
    }

    componentDidMount(){
        console.log('componentDidMount started');

        this.state.socket.emit('connect_message', { channel: this.state.channel, message: 'Hello world!'});

        this.state.socket.on('channel_info', (data) => {
            if(data) {
                console.log('channel_info : ' + data.id);
                console.dir(data);
                this.setState({
                    channel_info: {
                        id: data.id,
                        name: data.name,
                        permaname: data.permaname,
                        title: data.title,
                        description: data.description,
                        image: data.image,
                        owner: data.owner
                    }
                });
            }
        });

        this.state.socket.on('message', (data) => {
            this.setState(prevState => ({ messageList : [...prevState.messageList, { username: data.username, message: data.message}]}));
        });

    }

    render() {
        return (
            <div className="App">
                <nav className="navbar fixed-left">
                    <ul>
                        <li>
                            <img className="user-image rounded" src="" title="Mon pseudo" /><br />
                            <span className="user-nickname">{ this.state.username }</span>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <img className="channel-image squared" src="" title="channel-name" />
                        </li>
                        <li>
                            <img className="channel-image squared" src="" title="channel-name" />
                        </li>
                        <li>
                            <img className="channel-image squared" src="" title="channel-name" />
                        </li>
                    </ul>
                </nav>
                <div className="main-panel container-fluid">
                    <header>
                    <div className="row">
                            <div className="channel-header col-6 no-gutter">
                                <span className="channel-header-name"><img className="channel-image rounded" src="" />{ this.state.channel_info.name }</span>
                            </div>
                            <div className="channel-header col-6 no-gutter">
                                <span className="channel-header-title">{ this.state.channel_info.title }</span>
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
                                { this.state.channel_info.description }
                            </section>
                        </div>
                        <div className="col-6">
                            <aside>
                                <div className="chat-box">
                                    { this.state.messageList.map( (message, index) =>
                                        <Message    key={index}
                                                    username={message.username}
                                                    message={message.message} />
                                    )}
                                </div>
                                <div className="chat-entry form-group">
                                    <input id="chat-input" type="text" className="form-control" onChange={this.updateChatInput.bind(this)} onKeyPress={this.sendMessage.bind(this)}/>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
