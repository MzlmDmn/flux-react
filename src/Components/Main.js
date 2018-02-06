import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import $ from 'jquery';
import Message from './Message';

class Main extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            channels: [],
            my_channels: [],
            channelNameInput: '',
            error: false
        };

        this.updateInput = this.updateInput.bind(this);
        this.createChannel = this.createChannel.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
    };

    updateInput(e){
        // On stocke l'input à chaque modification
        this.setState({ channelNameInput: e.target.value});
    }

    createChannel(){
        // On vérifie que l'utilisateur a rentré un nom pour le salon
        if (this.state.channelNameInput !== '') {
            this.props.socket.emit('create_channel', this.state.channelNameInput);
            this.props.socket.emit('get_channels');
            this.setState({ channelNameInput: '' });
            $('#channel-name-input').val('');
        }
    }

    deleteChannel(id){
        if(id){
            this.props.socket.emit('delete_channel', id);
            this.props.socket.emit('get_channels');
        }
    }

    // COMPONENT CYCLE

    componentWillMount(){
        this.props.socket.emit('get_channels');
    }
    componentDidMount(){
        this.props.socket.on('get_channels', (data) =>{
            this.setState({ channels: data, my_channels: []});
            for(let channel of data){
                if(channel.owner === this.props.username){
                    this.setState(prevState => ({ my_channels : [...prevState.my_channels, channel]}))
                }
            }
            if(this.props.username === undefined){ this.props.socket.emit('get_channels'); }
        });

        this.props.socket.on('create_channel', (data) => {
            if(data){
                setTimeout(() => { this.props.history.push('/' + data); }, 1000);
            } else{
                this.setState({
                    error: true
                })
            }
        });
    }

    render(){

        return(
            <div className="main-panel container-fluid">
                <header>
                    <div className="row no-gutter">
                        <div className="channel-header col-6">
                            Toutes les chaînes
                        </div>
                        <div className="channel-header col-6">
                            Mes chaînes
                            <button type="button" className="btn btn-warning float-right" onClick={()=>{ this.props.history.push('/');}}>
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                </header>
                <div className="row no-gutter">
                    <section className="col-6">
                        <table className="table">
                            <tbody>
                                { this.state.channels.map( (channel, index) =>
                                    <tr key={index}>
                                        <th scope="row"><img className="channel-image rounded" src={ channel.image } /></th>
                                        <td><span className="channel-header-name">{ channel.name }</span><br />{ channel.title }</td>
                                        <td><button className="btn btn-primary"><Link to={'/' + channel.permaname } >Rejoindre</Link></button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                    <aside className="col-6">
                        <input id="channel-name-input" type="text" className="form-control" onChange={this.updateInput} />
                        <button className="btn btn-primary" onClick={this.createChannel}>Créer un salon</button>{ this.state.error && <span> - Vérifiez les caractères que vous avez entrés.</span> }
                        <table className="table">
                            <tbody>
                            { this.state.my_channels.map( (channel, index) =>
                                <tr key={index}>
                                    <th scope="row"><img className="channel-image rounded" src={ channel.image } /></th>
                                    <td><span className="channel-header-name">{ channel.name }</span><br />{ channel.title }</td>
                                    <td><button className="btn btn-primary"><Link to={'/' + channel.permaname } >Rejoindre</Link></button><button className="btn btn-danger" onClick={()=>{ this.deleteChannel(channel.id); }}>Supprimer</button></td>
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

export default Main;


