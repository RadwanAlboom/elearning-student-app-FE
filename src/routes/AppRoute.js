import React, { Component, lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import auth from '../services/authService';
import Navbar from '../components/Navbar.jsx';

import UserRoute from './UserRoute';
import { socketMsg } from '../socket';
import RequestLoader from '../components/RequestLoader.jsx';

const AdminRoute = lazy(() => import('./AdminRoute'));
const ModeratorRoute = lazy(() => import('./ModeratorRoute'));
const NotFound = lazy(() => import('../pages/NotFound'));

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
                    <Suspense fallback={<div style={{marginTop: "100px"}}><RequestLoader width={160} height={160}/></div>}>
                        <Switch>
                            <Route path="/admin" component={AdminRoute} />
                            <Route path="/moderator" component={ModeratorRoute} />
                            <Route path="/not-found" component={NotFound} />
                            <Route path="/" component={UserRoute} />
                            <Redirect to="/not-found" />
                        </Switch>
                    </Suspense>
                </div>
            </>
        );
    }
}

export default AppRoute;
