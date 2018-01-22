import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import $ from 'jquery';

class Login extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            success: false,
            error: false,
            form_error: false,
            register_success: false,
            register_error: false
        };
        this.registerUser = this.registerUser.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.loginUser = this.loginUser.bind(this);
    }

    // Inscription

    registerUser(){
        if(this.validateForm()){
            this.setState({ form_error: false });
            this.props.socket.emit('register_user', {
                username : $('#username').val(),
                mail : $('#mail').val(),
                password : $('#password').val()
            })
        } else{
            console.log('declare error')
            this.setState({ form_error: true });
        }
    }

    // Validation du formulaire d'inscription

    validateForm(){
        let username = $('#username').val();
        let mail = $('#mail').val();
        let password = $('#password').val();
        let confirmpassword = $('#confirmpassword').val();
        let user_reg = /^[a-zA-Z0-9]+$/;
        let mail_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // Valider l'username avec Regex azAZ09 et la longueur
        if(!user_reg.test(username) || username.length <= 5){
            return false;
        } // Valider la longueur du mot de passe et que les deux mots de passes sont pareils.
        else if(password !== confirmpassword || password.length <= 7){
            return false;
        } // Valider l'email avec Regex
        else if(!mail_reg.test(mail.toLowerCase())){
            return false;
        }
        return true;
    }

    // Connexion

    loginUser(){
        let username = $('#username').val();
        let password = $('#password').val();

        // Envoyer la requête de demande de connexion
        this.props.socket.emit('connect_auth', { username: username, password: password});
    }

    // COMPONENT CYCLE

    componentWillMount(){

    }

    componentDidMount(){
        this.props.socket.on('register_user', (data) => {
            if(data.success){
                this.setState({
                    error: false,
                    register_success : true,
                    register_error : false
                })
            } else if(data.error){
                this.setState({
                    error: false,
                    register_success : false,
                    register_error : true
                })
            }
        });

        this.props.socket.on('connect_auth', (data) => {
            if(!data){
                this.setState({ error: true });
            } else {
                this.props.history.push('/app');
            }
        });

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
                                <Switch>
                                    <Route path="/login/register" render={props =>
                                        <div>
                                            { this.state.register_success && <p>Votre compte a été créé avec succès! Vérifiez vos mails pour activer votre compte.</p> }
                                            { this.state.register_error && <p>Ce nom d'utilisateur ou cet adresse mail est déjà utilisée.</p> }
                                            { this.state.form_error && <p>Vérifiez les informations que vous avez entré.</p> }
                                            <h2>Inscription</h2>
                                            <form action="javascript:void(0);">
                                                <div className="form-group">
                                                    <label>Nom d'utilisateur</label>
                                                    <input type="text" className="form-control" id="username" placeholder="Nom d'utilisateur" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Adresse mail</label>
                                                    <input type="text" className="form-control" id="mail" placeholder="Adresse mail" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Mot de passe</label>
                                                    <input type="password" className="form-control" id="password" placeholder="Mot de passe" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Confirmer le mot de passe</label>
                                                    <input type="password" className="form-control" id="confirmpassword" placeholder="Mot de passe" />
                                                </div>
                                                <button type="submit" className="btn btn-primary" onClick={this.registerUser}>S'inscrire</button>
                                                <button type="submit" className="btn btn-warning"><Link to={'/login'}>Se connecter</Link></button>
                                            </form>
                                        </div>
                                    } />
                                    <Route path="/login" render={props =>
                                        <div>
                                            { this.state.error && <p>Vérifiez les informations que vous avez entré</p> }
                                            <h2>Connexion</h2>
                                            <form action="javascript:void(0);">
                                                <div className="form-group">
                                                    <label>Nom d'utilisateur</label>
                                                    <input type="text" className="form-control" id="username" placeholder="Nom d'utilisateur" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Mot de passe</label>
                                                    <input type="password" className="form-control" id="password" placeholder="Mot de passe" />
                                                </div>
                                                <button type="submit" className="btn btn-primary" onClick={this.loginUser}>Se connecter</button>
                                                <button type="submit" className="btn btn-warning"><Link to={'/login/register'}>Créer un compte</Link></button>
                                            </form>

                                        </div>
                                    } />
                                </Switch>
                            </div>
                            <div className="col-3"></div>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;


