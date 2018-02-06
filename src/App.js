import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import $ from 'jquery';
import './App.css';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import Main from './Components/Main';
import Channel from './Components/Channel';
import Admin from './Components/Admin';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            socket: io('https://flux.mzlm.be'),
            user: {
                history: []
            },
            channel_info: {},
            channels: []
        };
    }


    componentWillMount(){

    }

    componentDidMount(){

        // Réception des informations du Channel, stockage en state
        this.state.socket.on('user_info', (data) => {
            if(data !== undefined) {
                console.log('user_info : ' + data.username);
                this.setState({
                    user: data
                });
            }
        });

        // Réception des informations du Channel, stockage en state
        this.state.socket.on('channel_info', (data) => {
            if(!data.error && data !== undefined) {
                console.log('channel_info : ' + data.permaname);
                this.setState({
                    channel_info: data
                });
            } else {
                // Si la chaîne n'existe pas, push vers /app
                this.props.history.push('/app');
            }
        });


    }

    render() {
        return (
            <div className="App">
                <Switch>
                    <Route path="/login" render={props =>
                        <Login
                            socket={this.state.socket}
                            history={this.props.history}
                        />
                    } />
                    <Route path="/app" render={props =>
                        <div>
                            <Navbar
                                user={this.state.user}
                                history={this.props.history}
                            />
                            <Main
                                socket={this.state.socket}
                                history={this.props.history}
                                username={this.state.user.username}
                            />
                        </div>
                    } />
                    <Route path="/admin" render={props =>
                        <div>
                            <Navbar
                                user={this.state.user}
                                history={this.props.history}
                            />
                            <Admin
                                socket={this.state.socket}
                            />
                        </div>
                    } />
                    <Route path="/:channel" render={props =>
                        <div>
                            <Navbar
                                user={this.state.user}
                                history={this.props.history}
                            />
                            <Channel
                                key={this.props.match.params.path}
                                channel={this.props.match.params.path}
                                socket={this.state.socket}
                                user={this.state.user}
                                name={this.state.channel_info.name}
                                title={this.state.channel_info.title}
                                description={this.state.channel_info.description}
                                image={this.state.channel_info.image}
                                owner={this.state.channel_info.owner}
                            />
                        </div>
                    } />
                </Switch>
            </div>
        );
    }
}

export default App;
