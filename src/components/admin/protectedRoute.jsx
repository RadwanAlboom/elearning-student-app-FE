import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../../services/authService';

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                const currentUser = auth.getCurrentUser();
                if (!currentUser)
                    return (
                        <Redirect
                            to={{
                                pathname: '/registration',
                                state: { from: props.location },
                            }}
                        />
                    );
                else if (currentUser && !currentUser.isAdmin) {
                    return (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: props.location },
                            }}
                        />
                    );
                }
                return Component ? <Component {...props} /> : render(props);
            }}
        />
    );
};

export default ProtectedRoute;
