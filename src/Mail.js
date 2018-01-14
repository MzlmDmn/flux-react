import React from 'react';
import { Link } from 'react-router-dom';

class Mail extends React.Component {

    componentWillMount(){
        // console.log('W!')
        // this.props.clearMessageList;
    }
    componentDidMount(){
        //
    }

    render(){
        return(
            <div className="App">
                <div className="main-panel container-fluid">
                    <header>
                        <div className="row">
                            <div className="channel-header col-12 no-gutter">
                                <span className="channel-header-name"><Link to={'/'} >Retourner à l'accueil</Link></span>
                            </div>
                        </div>
                    </header>
                    <div className="row">
                        <div className="col-12">
                            <section>
                                Mail
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Mail;


