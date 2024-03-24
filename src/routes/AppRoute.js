import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import auth from '../services/authService';
import Navbar from '../components/Navbar.jsx';
import NotFound from '../pages/NotFound';

import UserRoute from './UserRoute';
import AdminRoute from './AdminRoute';
import ModeratorRoute from './ModeratorRoute';

import { socketMsg } from '../socket';

class AppRoute extends Component {
    state = {};

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({ user });

        user && socketMsg.emit('RefreshSocketIds', { userId: user.id });
    }
    render() {
        return (
            <>
                <div className="App">
                    <div onContextMenu={(e) => e.preventDefault()}>
                        <Navbar user={this.state.user} />
                    </div>
                    <Switch>
                        <Route path="/admin" component={AdminRoute} />
                        <Route path="/moderator" component={ModeratorRoute} />
                        <Route path="/not-found" component={NotFound} />
                        <Route path="/" component={UserRoute} />
                        <Redirect to="/not-found" />
                    </Switch>
                </div>
            </>
        );
    }
}

export default AppRoute;
