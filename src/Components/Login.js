import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import $ from 'jquery';
import Message from './Message';

class Login extends React.Component {
    constructor(){
        super();

        this.state = {
        };
        this.registerUser = this.registerUser.bind(this);
    };

    // Inscription

    registerUser(){
        let checks = 0;

    }

    // Validation functions

    validateForm(){

    }

    // COMPONENT CYCLE

    componentWillMount(){

    }
    componentDidMount(){

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
                                            <h2>Inscription</h2>
                                            <form>
                                                <div class="form-group">
                                                    <label for="username">Nom d'utilisateur</label>
                                                    <input type="text" class="form-control" id="username" placeholder="Nom d'utilisateur" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="password">Mot de passe</label>
                                                    <input type="password" class="form-control" id="password" placeholder="Mot de passe" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="confirmpassword">Confirmer le mot de passe</label>
                                                    <input type="password" class="form-control" id="confirmpassword" placeholder="Mot de passe" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="username">Adresse mail</label>
                                                    <input type="text" class="form-control" id="mail" placeholder="Adresse mail" />
                                                </div>
                                                <button type="submit" class="btn btn-primary" onClick={this.registerUser}>S'inscrire</button>
                                            </form>
                                        </div>
                                    } />
                                    <Route path="/login" render={props =>
                                        <div>
                                            <h2>Connexion</h2>
                                            <form>
                                                <div class="form-group">
                                                    <label for="username">Nom d'utilisateur</label>
                                                    <input type="text" class="form-control" id="username" placeholder="Nom d'utilisateur" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="password">Mot de passe</label>
                                                    <input type="password" class="form-control" id="password" placeholder="Mot de passe" />
                                                </div>
                                                <button type="submit" class="btn btn-primary">Se connecter</button>
                                                <button type="submit" class="btn btn-warning"><Link to={'/login/register'}>Créer un compte</Link></button>
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


