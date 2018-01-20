import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './App';
import Home from './Home';
import Mail from './Mail';

class Router extends React.Component {
    render(){
        return(
            <Switch>
                <Route exact path={'/'} component={Home} />
                <Route path={'/mail/:validationkey'} component={Mail} />
                <Route path={'/:path'} component={App} />
            </Switch>
        )
    }
}

export default Router;


