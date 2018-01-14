import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import $ from 'jquery';
import './App.css';
import Navbar from './Components/Navbar';
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
            this.state.socket.emit('message', { from: this.state.user.username, on: this.props.match.params.path, msg: this.state.chatInput});
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
        console.log('componentDidMount');



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
                <Navbar
                    username={this.state.user.username}
                />
                <Switch>
                    <Route path="/:channel" render={props =>
                        <Channel
                            key={this.props.match.params.path}
                            channel={this.props.match.params.path}
                            socket={this.state.socket}
                            messageList={this.state.messageList}
                            name={this.state.channel_info.name}
                            title={this.state.channel_info.title}
                            description={this.state.channel_info.description}
                            sendMessage={this.sendMessage.bind(this)}
                            updateChatInput={this.updateChatInput.bind(this)}
                            clearMessageList={this.clearMessageList.bind(this)}
                        />
                    } />

                </Switch>
            </div>
        );
    }
}

export default App;
