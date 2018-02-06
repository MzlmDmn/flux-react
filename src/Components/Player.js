import React from 'react';

class Player extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            video_id: 'M7lc1UVf-VE'
        }
    }

    render(){
        return(
            <div className="embed-flux embed-responsive embed-responsive-16by9">
                <iframe id="player" className="embed-responsive-item" type="text/html"
                        src={'https://www.youtube.com/embed/' + this.props.video_id + '?enablejsapi=1&autoplay=0'} ></iframe>
            </div>
        )
    }
}

export default Player;