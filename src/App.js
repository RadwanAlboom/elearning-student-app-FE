import React, { useEffect, useState } from "react";
import CacheBuster from "react-cache-buster";
import { version } from "../package.json";
import socketIOClient from "socket.io-client";
import { Switch, Route, useHistory } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Redirect } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Registration from "./pages/Registration";
import Logout from "./components/logout";
import AppRoute from "./routes/AppRoute";
import auth from "./services/authService";
import configureStore from "./store/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Verification from "./pages/user/Verification";
import Loader from "./components/Loader";

const devTools = require("browser-detect-devtools");
const devToolsManager = devTools.Manager;

const store = configureStore();
let persistor = persistStore(store);

let backendURL = process.env.REACT_APP_API_URL;
let socket;

const App = () => {
    const history = useHistory();
    const [isDevtoolsOpen, setIsDevtoolsOpen] = useState(false);

    useEffect(() => {
        const config = {
            pollingIntervalSeconds: 0.25,
            maxMillisBeforeAckWhenClosed: 100,
            moreAnnoyingDebuggerStatements: 1,

            onDetectOpen: undefined,
            onDetectClose: undefined,

            startup: "asap",
            onCheckOpennessWhilePaused: "returnStaleValue",
        };
        Object.seal(config);

        const heart = new Worker(
            URL.createObjectURL(
                new Blob(
                    [
                        `"use strict";
        onmessage = (ev) => { postMessage({isOpenBeat:true});
            debugger; for (let i = 0; i < ev.data.moreDebugs; i++) { debugger; }
            postMessage({isOpenBeat:false});
        };`,
                    ],
                    { type: "text/javascript" }
                )
            )
        );

        let _isDevtoolsOpen = false;
        let _isDetectorPaused = true;

        let resolveVerdict = undefined;
        let nextPulse$ = NaN;

        const onHeartMsg = (msg) => {
            if (msg.data.isOpenBeat) {
                let p = new Promise((_resolveVerdict) => {
                    resolveVerdict = _resolveVerdict;
                    let wait$ = setTimeout(() => {
                        wait$ = NaN;
                        resolveVerdict(true);
                    }, config.maxMillisBeforeAckWhenClosed + 1);
                });
                p.then((verdict) => {
                    if (verdict === null) return;
                    if (verdict !== _isDevtoolsOpen) {
                        _isDevtoolsOpen = verdict;
                        setIsDevtoolsOpen(verdict);
                    }
                    nextPulse$ = setTimeout(() => {
                        nextPulse$ = NaN;
                        doOnePulse();
                    }, config.pollingIntervalSeconds * 1000);
                });
            } else {
                resolveVerdict(false);
            }
        };

        const doOnePulse = () => {
            heart.postMessage({
                moreDebugs: config.moreAnnoyingDebuggerStatements,
            });
        };

        const detector = {
            config,
            get isOpen() {
                if (
                    _isDetectorPaused &&
                    config.onCheckOpennessWhilePaused === "throw"
                ) {
                    throw new Error(
                        '`onCheckOpennessWhilePaused` is set to `"throw"`.'
                    );
                }
                return _isDevtoolsOpen;
            },
            get paused() {
                return _isDetectorPaused;
            },
            set paused(pause) {
                if (_isDetectorPaused === pause) {
                    return;
                }
                _isDetectorPaused = pause;
                if (pause) {
                    heart.removeEventListener("message", onHeartMsg);
                    clearTimeout(nextPulse$);
                    nextPulse$ = NaN;
                    resolveVerdict(null);
                } else {
                    heart.addEventListener("message", onHeartMsg);
                    doOnePulse();
                }
            },
        };
        Object.freeze(detector);

        switch (config.startup) {
            case "manual":
                break;
            case "asap":
                detector.paused = false;
                break;
            case "domContentLoaded": {
                if (document.readyState !== "loading") {
                    detector.paused = false;
                } else {
                    document.addEventListener(
                        "DOMContentLoaded",
                        (ev) => {
                            detector.paused = false;
                        },
                        { once: true }
                    );
                }
                break;
            }
        }

        socket = socketIOClient(backendURL);
        document.addEventListener("keydown", keydownHandler);

        return () => {
            socket.disconnect();
            document.removeEventListener("keydown", keydownHandler);
        };
    }, []);

    if (isDevtoolsOpen) {
        const user = auth.getCurrentUser();
        if (user && !user.isAdmin) {
            socket.emit("fraud", { email: user.email });
            auth.logout();
            window.location = "/registration";
        }
    }

    const keydownHandler = (e) => {
        if (e.keyCode === 123) e.preventDefault();
    };
    return (
        <CacheBuster
            currentVersion={version}
            isEnabled={true} //If false, the library is disabled.
            isVerboseMode={false} //If true, the library writes verbose logs to console.
            loadingComponent={<Loader />} //If not pass, nothing appears at the time of new version check.
            metaFileDirectory={"."} //If public assets are hosted somewhere other than root on your server.
        >
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
                                                    pathname: "/",
                                                    state: {
                                                        from: props.location,
                                                    },
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
                                                    pathname: "/",
                                                    state: {
                                                        from: props.location,
                                                    },
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
        </CacheBuster>
    );
};

export default App;
