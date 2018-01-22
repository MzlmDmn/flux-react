import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import $ from 'jquery';
import './App.css';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import Channel from './Components/Channel';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            socket: io('http://flux.mzlm.be'),
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
                    user: {
                        username: data.username,
                        mail: data.mail,
                        bio: data.bio,
                        image: data.image,
                        history: data.history,
                        created_at: data.created_at
                    }
                });
            }
        });

        // Réception des informations du Channel, stockage en state
        this.state.socket.on('channel_info', (data) => {
            if(!data.error && data !== undefined) {
                console.log('channel_info : ' + data.permaname);
                this.setState({
                    channel_info: {
                        id: data.id,
                        name: data.name,
                        permaname: data.permaname,
                        title: data.title,
                        description: data.description,
                        image: data.image,
                        owner: data.owner,
                        created_at: data.created_at
                    }
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
