import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

class Main extends Component {
    constructor(){
        super();
        this.state = { txt: 'Test'};
    }

    update(e){
        this.setState({ txt: e.target.value });
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to my app ! :D</h1>
                    <input type="text" onChange={this.update.bind(this)} />
                    {this.state.txt}
                </header>
                <div className="menu">
                    <ul>
                        <li> <Link to="/">Home</Link></li>
                        <li> <Link to="/messages">Messages</Link></li>
                        <li> <Link to="/about">About</Link></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Main;
