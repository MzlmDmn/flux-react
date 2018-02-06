import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import $ from 'jquery';
import SocketIOFileClient from 'socket.io-file-client';
import Player from './Player';
import Search from './Search';
import Message from './Message';

class Channel extends React.Component {
    constructor(){
        super();

        this.state = {
            chatInput: '',
            messageList: [],
            video_id: 'M7lc1UVf-VE',
            showSearch: false
        };

        this.updateChatInput = this.updateChatInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.editChannel = this.editChannel.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.showSearch = this.showSearch.bind(this);
        this.hideSearch = this.hideSearch.bind(this);
        this.requestVideoUpdate = this.requestVideoUpdate.bind(this);
    };

    // EDIT CHANNEL

    editChannel(){
        console.log('Update channel!');
        if($('#channel-title').val() !== '' && $('#channel-description') !== ''){
            // On vérifie que les champs sont complétés et on emit la requête
            this.props.socket.emit('edit_channel', {
                title: $('#channel-title').val(),
                description: $('#channel-description').val(),
                image: '/img/default.png'
            });
            if ($('#channel-image-input').get(0).files.length !== 0) {
                this.uploadImage();
            }
        }
    }

    uploadImage(){
        const file = $("#channel-image-input")[0];
        const upload = this.state.uploader.upload(file, {
            data: { /* Arbitrary data... */ }
        });
    }

    // CHATBOX

    updateChatInput(e){
        // On stocke l'input à chaque modification
        this.setState({ chatInput: e.target.value});
    }

    sendMessage(e){
        // On vérifie que la touche Enter a été appuyée et que le chatInput ne soit pas vide
        if (e.key === 'Enter' && this.state.chatInput !== '') {
            this.props.socket.emit('message', this.state.chatInput);
            $(".chat-box").animate({ scrollTop: $(".chat-box")[0].scrollHeight}, 1000);
            this.setState({ chatInput: '' });
            $('#chat-input').val('');
            // On envoi le message, scroll la chatbox et on clear l'input
        }
    }

    clearMessageList(){
        this.setState({ messageList: []})
    }

    // SEARCH BOX

    showSearch(){
        this.setState({ showSearch : true })
    }

    hideSearch(){
        this.setState({ showSearch : false })
    }

    requestVideoUpdate(id){
        this.props.socket.emit('video_update', id);
        this.hideSearch();
    }

    // COMPONENT CYCLE

    componentWillMount(){
        console.log('Channel mounted!')

        const uploader = new SocketIOFileClient(this.props.socket);
        this.setState({ uploader: uploader});
    }
    componentDidMount(){

        this.props.socket.emit('connect_message', { channel: this.props.channel, message: 'Hello world!'});

        this.props.socket.on('message', (data) => {
            this.setState(prevState => ({ messageList : [...prevState.messageList, { username: data.username, message: data.message}]}));
        });

        this.props.socket.on('video_update', (data) => {
            console.log(data);
            this.setState({ video_id: data});
        });

        // Ecouter si une image a été uploadée
        this.state.uploader.on('complete', (fileInfo) => {
            this.forceUpdate();
        });
    }

    render(){

        return(
            <div className="main-panel container-fluid">
                <header>
                    <div className="row no-gutter">
                        <div className="channel-header col-6">
                            <Switch>
                                <Route path="/:channel/edit" render={props =>
                                    <span className="channel-header-name"><img className="channel-image rounded" src={ this.props.image } /><input className="form-control image-submit" type="file" id="channel-image-input" /></span>
                                } />
                                <Route path="/:channel" render={props =>
                                    <span className="channel-header-name"><img className="channel-image rounded" src={ this.props.image } />{ this.props.name }</span>
                                } />
                            </Switch>
                            {this.props.user.username === this.props.owner &&
                                <Switch>
                                    <Route path="/:channel/edit" render={props =>
                                        <div className="channel-control">
                                            <button className="btn btn-primary" onClick={this.editChannel}><Link to={'/' + this.props.channel }>Sauver</Link></button> <button className="btn btn-primary"><Link to={'/' + this.props.channel }>Annuler</Link></button>
                                        </div>
                                    } />
                                    <Route path="/:channel" render={props =>
                                        <div className="channel-control">
                                            <button className="btn btn-primary"><Link to={'/' + this.props.channel + '/edit'}>Editer</Link></button>
                                        </div>
                                    } />
                                </Switch>
                            }
                        </div>
                        <div className="channel-header col-6">
                            <Switch>
                                <Route path="/:channel/edit" render={props =>
                                    <div>
                                        <input className="form-control" type="text" id="channel-title" defaultValue={ this.props.title } />
                                    </div>
                                } />
                                <Route path="/:channel" render={props =>
                                    <div>
                                        <span className="channel-header-title">{ this.props.title }</span>
                                    </div>
                                } />
                            </Switch>
                        </div>
                    </div>
                </header>
                <div className="row no-gutter">
                    <section className="col-6">
                        <Player video_id={this.state.video_id} />
                        <br />
                        <Switch>
                            <Route path="/:channel/edit" render={props =>
                                <div>
                                    <textarea className="form-control" rows="16" id="channel-description" defaultValue={ this.props.description } />
                                </div>
                            } />
                            <Route path="/:channel" render={props =>
                                <div>
                                    <button type="button" className="btn btn-warning float-right" onClick={this.showSearch}>
                                        Changer la vidéo
                                    </button>
                                    { this.state.showSearch ? <Search requestVideoUpdate={this.requestVideoUpdate} hideSearch={this.hideSearch} /> : null }
                                    <p className="channel-description">{ this.props.description }</p>
                                </div>
                            } />
                        </Switch>
                    </section>
                    <aside className="col-6">
                        <div className="chat-box">
                            { this.state.messageList.map( (message, index) =>
                                <Message    key={index}
                                            username={message.username}
                                            message={message.message} />
                            )}
                        </div>
                        <div className="chat-entry form-group">
                            <input id="chat-input" type="text" className="form-control" onChange={this.updateChatInput} onKeyPress={this.sendMessage}/>
                        </div>
                    </aside>
                </div>
            </div>
        )
    }
}

export default Channel;


