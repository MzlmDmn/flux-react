import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import $ from 'jquery';
import Message from './Message';

class Admin extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            users: [],
            channels: []
        };

        this.deleteUser = this.deleteUser.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);

    };

    // COMPONENT CYCLE

    componentWillMount(){
        this.props.socket.emit('get_users');
        this.props.socket.emit('get_channels');
    }
    componentDidMount(){
        this.props.socket.on('get_users', (data) =>{
            this.setState({ users: data})
        });
        this.props.socket.on('get_channels', (data) =>{
            this.setState({ channels: data})
        });
    }

    deleteUser(username){
        this.props.socket.emit('delete_user', username);
        this.props.socket.emit('get_users');
        this.props.socket.emit('get_channels');
    }

    deleteChannel(id){
        this.props.socket.emit('delete_channel', id);
        this.props.socket.emit('get_users');
        this.props.socket.emit('get_channels');
    }

    render(){

        return(
            <div className="main-panel container-fluid">
                <header>
                    <div className="row no-gutter">
                        <div className="channel-header col-6">
                           Utilisateurs
                        </div>
                        <div className="channel-header col-6">
                           Chaines
                        </div>
                    </div>
                </header>
                <div className="row no-gutter">
                    <section className="col-6">
                        <table className="table">
                            <thead className="thead-inverse">
                            <tr>
                                <th>#</th>
                                <th>Nom d'utilisateur</th>
                                <th>Adresse mail</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                        { this.state.users.map( (user, index) =>
                            <tr key={index}>
                                <th scope="row">{ user.id }</th>
                                <td>{ user.username }</td>
                                <td>{ user.mail }</td>
                                <td><button className="btn btn-primary" onClick={()=>this.deleteUser(user.username)}>Supprimer</button></td>
                            </tr>
                        )}
                            </tbody>
                        </table>
                    </section>
                    <aside className="col-6">
                        <table className="table">
                            <thead className="thead-inverse">
                            <tr>
                                <th>#</th>
                                <th>Nom</th>
                                <th>Propriétaire</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            { this.state.channels.map( (channel, index) =>
                                <tr key={index}>
                                    <th scope="row">{ channel.id }</th>
                                    <td>{ channel.name }</td>
                                    <td>{ channel.owner }</td>
                                    <td><button className="btn btn-primary" onClick={()=>this.deleteChannel(channel.id)}>Supprimer</button></td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </aside>
                </div>
            </div>
        )
    }
}

export default Admin;


