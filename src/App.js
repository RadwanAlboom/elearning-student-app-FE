import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
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

const store = configureStore();
let persistor = persistStore(store);

const App = () => {
    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);

        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
    }, []);

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
                        <Route path="/logout" component={Logout} />
                        <Route path="/" component={AppRoute} />
                    </Switch>
                </div>
            </PersistGate>
        </Provider>
    );
};

export default App;
