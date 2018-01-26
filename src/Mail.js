import React from 'react';
import {  Link } from 'react-router-dom';
import io from 'socket.io-client';

class Mail extends React.Component {
    constructor(){
        super();

        this.state = {
            socket: io('http://flux.mzlm.be'),
            error: true
        };
    }

    componentWillMount(){
        this.state.socket.emit('mail_verification', this.props.match.params.validationkey);
    }

    componentDidMount(){
        this.state.socket.on('mail_verification', (data) => {
            if(data){
                this.setState({ error: false });
            } else{
                this.setState({ error: true });
            }
        })
    }

    render(){

        return(
            <div className="App">
                <div className="main-panel container-fluid">
                    <header>
                        <div className="row no-gutter">
                            <div className="col-3"></div>
                            <div className="col-6">
                                <h1>Flux</h1>
                            </div>
                            <div className="col-3"></div>
                        </div>
                    </header>
                    <div className="row no-gutter">
                        <section>
                            <div className="col-3"></div>
                            <div className="col-6">
                                <div>
                                    <h2>Mail de vérification</h2>
                                    { !this.state.error &&
                                        <div>
                                            <p>Merci d'avoir activé votre compte!</p>
                                            <button type="submit" className="btn btn-primary"><Link to={'/login'}>Se connecter</Link></button><button type="submit" className="btn btn-warning"><Link to={'/login/register'}>S'inscrire</Link></button>
                                        </div>
                                    }
                                    { this.state.error &&
                                        <div>
                                            <p>Cet utilisateur n'existe pas ou a déjà été activé.</p>
                                            <button type="submit" className="btn btn-primary"><Link to={'/login/register'}>S'inscrire</Link></button>
                                        </div>
                                    }

                                </div>
                            </div>
                            <div className="col-3"></div>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}

export default Mail;



