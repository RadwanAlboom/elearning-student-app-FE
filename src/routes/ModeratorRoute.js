import { Switch, useLocation, Redirect } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

import ProtectedRoute from '../components/moderator/protectedRoute';
import Sidebar from '../components/moderator/Sidebar';
import Profile from '../pages/moderator/Profile';
import Exams from '../pages/moderator/Exams';
import Review from '../pages/moderator/Review';
import ModeratorCoursesRoute from './ModeratorCoursesRoute';
import Projects from '../pages/moderator/Projects';
import Export from './../pages/moderator/Export';
import ZoomLink from '../pages/moderator/ZoomLink';
import '../components/style.css';

const Pages = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    padding-left: 60px;
    background-color: rgba(137, 171, 245, 0.37);

    h3 {
        font-size: calc(1.2rem + 1.2vw);
        background: linear-gradient(to right, #803bec 30%, #1b1b1b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;

function ModeratorRoute() {
    const location = useLocation();
    return (
        <>
            <Sidebar />
            <Pages className="routes-no-padding">
                <AnimatePresence exitBeforeEnter>
                    <div style={{ width: '100%' }}>
                        <Switch location={location} key={location.pathname}>
                            <ProtectedRoute
                                path="/moderator/zoomLink"
                                component={ZoomLink}
                            />
                            <ProtectedRoute
                                path="/moderator/export"
                                component={Export}
                            />
                            <ProtectedRoute
                                path="/moderator/exams/review"
                                component={Review}
                            />
                            <ProtectedRoute
                                path="/moderator/exams"
                                component={Exams}
                            />
                            <ProtectedRoute
                                path="/moderator/courses"
                                component={ModeratorCoursesRoute}
                            />
                            <ProtectedRoute
                                path="/moderator/projects"
                                component={Projects}
                            />
                            <ProtectedRoute
                                path="/moderator/profile"
                                component={Profile}
                            />
                            <Redirect
                                from="/moderator"
                                exact
                                to="/moderator/profile"
                            />
                        </Switch>
                    </div>
                </AnimatePresence>
            </Pages>
        </>
    );
}

export default ModeratorRoute;
