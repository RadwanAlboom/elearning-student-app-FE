import { useEffect } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router';
import Sidebar from '../components/user/Sidebar';
import UserCoursesRoute from './UserCoursesRoute';
import Team from '../pages/user/Team';
import Exams from '../pages/user/Exams';
import Home from '../pages/user/Home';
import ContactUs from '../pages/user/ContactUs';
import CourseCurriculum from '../pages/user/CourseCurriculum';
import Profile from '../pages/user/Profile';
import Review from '../pages/user/Review';
import TeacherProfile from '../pages/user/TeacherProfile';
import ChatRoom from '../pages/user/ChatRoom';
import ZoomLink from '../pages/user/ZoomLink';
import ProtectedRoute from '../components/protectedRoute';
import UserProtectedRoute from '../components/user/protectedRoute';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import '../components/style.css';

const Pages = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    padding-left: 60px;
    background-color: rgba(137, 171, 245, 0.37);

    h3 {
        font-size: calc(1rem + 1vw);
        background: linear-gradient(to right, #803bec 30%, #1b1b1b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        font-weight: bold;
    }
`;

function UserRoute() {
    const location = useLocation();
    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);

        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
    }, []);

    const keydownHandler = (e) => {
        if (e.ctrlKey) e.preventDefault();
    };
    return (
        <div onContextMenu={(e) => e.preventDefault()}>
            <Sidebar />
            <Pages className="routes-no-padding">
                <AnimatePresence exitBeforeEnter>
                    <div
                        style={{
                            width: '100%',
                        }}
                        className="scrollable"
                    >
                        <Switch location={location} key={location.pathname}>
                            <Route path="/team" component={Team} />
                            <ProtectedRoute
                                path="/zoomLink"
                                component={ZoomLink}
                            />
                            <UserProtectedRoute
                                path="/chatRoom"
                                exact
                                component={ChatRoom}
                            />
                            <UserProtectedRoute
                                path="/teacherProfile"
                                exact
                                component={TeacherProfile}
                            />
                            <UserProtectedRoute
                                path="/user/exams/review"
                                component={Review}
                            />
                            <UserProtectedRoute
                                path="/user/exams"
                                component={Exams}
                            />
                            <ProtectedRoute
                                path="/courses"
                                component={UserCoursesRoute}
                            />
                            <Route path="/contactUs" component={ContactUs} />
                            <Route
                                path="/courseCurriculum"
                                component={CourseCurriculum}
                            />
                            <UserProtectedRoute
                                path="/user/profile"
                                component={Profile}
                            />
                            <Redirect from="/user" exact to="/user/profile" />
                            <Route path="/" component={Home} />
                        </Switch>
                    </div>
                </AnimatePresence>
            </Pages>
        </div>
    );
}

export default UserRoute;
