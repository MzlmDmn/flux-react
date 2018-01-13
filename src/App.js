import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import $ from 'jquery';
import logo from './logo.svg';
import './App.css';
import Channel from './Components/Channel';

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
        // On stocke l'input à chaque modification
        this.setState({ chatInput: e.target.value});
    }

    sendMessage(e){
        if (e.key === 'Enter') {
            this.state.socket.emit('message', { from: this.state.user.username, on: this.props.match.params.channel, msg: this.state.chatInput});
            $('#chat-input').val('');
            // On envoi le message et on clear l'input
        }
    }

    clearMessageList(){
        this.setState({ messageList: []})
    }

    componentWillMount(){
        this.state.socket.emit('connect_auth', { username: this.state.user.username });
    }

    componentDidMount(){
        console.log('componentDidMount started');



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

    componentWillUpdate(){
        console.log('componentWillUpdate');
    }

    componentDidUpdate(){
    }
    componentWillReceiveProps(newProps){
        /* if(this.state.channel != newProps.params.channel){
            console.log('Channel changed!');
            this.setState({ channel : newProps.params.channel });
            this.state.socket.emit('connect_message', { channel: newProps.params.channel, message: 'Hello world!'});
        } */
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
                <Channel key={this.props.match.params.channel}
                         channel={this.props.match.params.channel}
                         socket={this.state.socket}
                         messageList={this.state.messageList}
                         name={this.state.channel_info.name}
                         title={this.state.channel_info.title}
                         description={this.state.channel_info.description}
                         sendMessage={this.sendMessage.bind(this)}
                         updateChatInput={this.updateChatInput.bind(this)}
                         clearMessageList={this.clearMessageList.bind(this)}
                />
            </div>
        );
    }
}

export default App;
