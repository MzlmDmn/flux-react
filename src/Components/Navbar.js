import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
    constructor(props){
        super(props);

    }

    componentWillMount(){

    }

    componentDidMount(){

    }

    render(){
        if(this.props.user.history){
            return(
                <nav className="navbar fixed-left">
                    <div>
                        <div className="title rounded"><Link to={'/app'} >Flux</Link></div>
                        <ul>
                            <li>
                                <img className="user-image rounded" src="" alt="" title="Mon image" /><br />
                                <span className="user-nickname">{ this.props.username }</span><br />
                                <Link to={'/chezoirdate'}>Aller chez Oirdate</Link>
                                <Link to={'/mazlumchannel'}>Aller chez Mazlum</Link>
                            </li>
                        </ul>
                        <ul>
                            { this.props.user.history.map( (channel, index) =>
                                <li>
                                    <Link to={'/' + channel.permaname } ><img className="channel-image rounded" src={channel.image} alt={channel.name} title={channel.name} /></Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </nav>
            )
        }
    }
}

export default Navbar;


