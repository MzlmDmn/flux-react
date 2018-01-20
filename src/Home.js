import React from 'react';
import {  Link } from 'react-router-dom';
import $ from 'jquery';

class Home extends React.Component {
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
                                    <h2>Bienvenue sur Flux, votre salon de discussion</h2>
                                        <button type="submit" className="btn btn-warning"><Link to={'/login'}>Accéder à l'application</Link></button>
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

export default Home;


