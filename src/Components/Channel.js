import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import $ from 'jquery';
import Message from './Message';

class Channel extends React.Component {
    constructor(){
        super();

        this.state = {
            chatInput: '',
            messageList: []
        };

        this.updateChatInput = this.updateChatInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        this.editChannel = this.editChannel.bind(this);
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
            this.forceUpdate();
        }
    }

    // CHATBOX

    updateChatInput(e){
        // On stocke l'input à chaque modification
        this.setState({ chatInput: e.target.value});
    }

    sendMessage(e){
        // On vérifie que la touche Enter a été appuyée et que le chatInput ne soit pas vide
        if (e.key === 'Enter' && this.state.chatInput !== '') {
            this.props.socket.emit('message', { from: this.props.user.username, msg: this.state.chatInput});
            $(".chat-box").animate({ scrollTop: $(".chat-box")[0].scrollHeight}, 1000);
            this.setState({ chatInput: '' });
            $('#chat-input').val('');
            // On envoi le message, scroll la chatbox et on clear l'input
        }
    }

    clearMessageList(){
        this.setState({ messageList: []})
    }

    // COMPONENT CYCLE

    componentWillMount(){
        console.log('Channel mounted!')
        // this.props.clearMessageList;
    }
    componentDidMount(){
        this.props.socket.emit('connect_message', { channel: this.props.channel, message: 'Hello world!'});

        this.props.socket.on('message', (data) => {
            this.setState(prevState => ({ messageList : [...prevState.messageList, { username: data.username, message: data.message}]}));
        });
    }

    render(){

        return(
            <div className="main-panel container-fluid">
                <header>
                    <div className="row no-gutter">
                        <div className="channel-header col-6">
                            <span className="channel-header-name"><img className="channel-image rounded" src="" />{ this.props.name }</span>
                            {this.props.user.username === this.props.owner &&
                                <Switch>
                                    <Route path="/:channel/edit" render={props =>
                                        <div className="channel-control">
                                            <button onClick={this.editChannel}><Link to={'/' + this.props.channel }>Sauver</Link></button> <button><Link to={'/' + this.props.channel }>Annuler</Link></button>
                                        </div>
                                    } />
                                    <Route path="/:channel" render={props =>
                                        <div className="channel-control">
                                            <button><Link to={'/' + this.props.channel + '/edit'}>Editer</Link></button>
                                        </div>
                                    } />
                                </Switch>
                            }
                        </div>
                        <div className="channel-header col-6">
                            <Switch>
                                <Route path="/:channel/edit" render={props =>
                                    <div>
                                        <input type="text" id="channel-title" defaultValue={ this.props.title } />
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
                        <div className="embed-flux embed-responsive embed-responsive-16by9">
                            <iframe id="player" className="embed-responsive-item" type="text/html"
                                    src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1"></iframe>
                        </div>
                        <br />
                        <Switch>
                            <Route path="/:channel/edit" render={props =>
                                <div>
                                    <textarea id="channel-description" defaultValue={ this.props.description }></textarea>
                                </div>
                            } />
                            <Route path="/:channel" render={props =>
                                <div>
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


