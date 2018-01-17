import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {

    componentWillMount(){

    }
    componentDidMount(){

    }

    render(){
        return(
            <nav className="navbar fixed-left">
                <ul>
                    <li>
                        <img className="user-image rounded" src="" alt="" title="Mon image" /><br />
                        <span className="user-nickname">{ this.props.username }</span><br />
                        <Link to={'/chezoirdate'}>Aller chez Oirdate</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <img className="channel-image squared" src="" alt="" title="channel-name" />
                    </li>
                    <li>
                        <img className="channel-image squared" src="" alt="" title="channel-name" />
                    </li>
                    <li>
                        <img className="channel-image squared" src="" alt="" title="channel-name" />
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;

