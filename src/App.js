import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Registration from './pages/Registration';
import Logout from './components/logout';
import AppRoute from './routes/AppRoute';
import auth from './services/authService';
import configureStore from './store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Verification from './pages/user/Verification';

const store = configureStore();
let persistor = persistStore(store);

let backendURL = process.env.REACT_APP_API_URL;
let socket;

const App = () => {
    const history = useHistory();

    useEffect(() => {
        socket = socketIOClient(backendURL);
        document.addEventListener('keydown', keydownHandler);

        return () => {
            socket.disconnect();
            document.removeEventListener('keydown', keydownHandler);
        };
    }, []);

    setInterval(function() {
        console.log(Object.defineProperties(new Error, {
            toString: {value() {(new Error).stack.includes('toString@') && alert('devtools')}},
            message: {get() {
                const user = auth.getCurrentUser();
                if (user && !user.isAdmin) {
                    socket.emit('fraud', { email: user.email });
                    auth.logout();
                    window.location = '/registration';
                }
            }},
          }));
    }, 1000);  

    const keydownHandler = (e) => {
        if (e.keyCode === 123) e.preventDefault();
    };
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ToastContainer />
                <div className="App">
                    <Switch>
                        <Route
                            path="/registration"
                            render={(props) => {
                                if (auth.getCurrentUser())
                                    return (
                                        <Redirect
                                            to={{
                                                pathname: '/',
                                                state: { from: props.location },
                                            }}
                                        />
                                    );
                                return <Registration {...props} />;
                            }}
                        />
                        <Route
                            path="/verification"
                            render={(props) => {
                                if (auth.getCurrentUser())
                                    return (
                                        <Redirect
                                            to={{
                                                pathname: '/',
                                                state: { from: props.location },
                                            }}
                                        />
                                    );
                                return <Verification {...props} />;
                            }}
                        />
                        <Route path="/logout" component={Logout} />
                        <Route path="/" component={AppRoute} />
                    </Switch>
                </div>
            </PersistGate>
        </Provider>
    );
};

export default App;
