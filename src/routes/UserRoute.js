import { useEffect, lazy, Suspense } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router';
import Sidebar from '../components/user/Sidebar';
import Home from '../pages/user/Home';
import ProtectedRoute from '../components/protectedRoute';
import UserProtectedRoute from '../components/user/protectedRoute';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import '../components/style.css';
import RequestLoader from '../components/RequestLoader';

const Team = lazy(() => import('../pages/user/Team'));
const ContactUs = lazy(() => import('../pages/user/ContactUs'));
const CourseCurriculum = lazy(() => import('../pages/user/CourseCurriculum'));
const Profile = lazy(() => import('../pages/user/Profile'));
const StudentProfile = lazy(() => import('../pages/admin/StudentProfile'));
const UserCoursesRoute = lazy(() => import('./UserCoursesRoute'));
const Exams = lazy(() => import('../pages/user/Exams'));
const Review = lazy(() => import('../pages/user/Review'));
const TeacherProfile = lazy(() => import('../pages/user/TeacherProfile'));
const ChatRoom = lazy(() => import('../pages/user/ChatRoom'));
const ZoomLink = lazy(() => import('../pages/user/ZoomLink'));

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
                        <Suspense fallback={<div style={{marginTop: "100px"}}><RequestLoader width={160} height={160}/></div>}>
                            <Switch location={location} key={location.pathname}>
                                <Route path="/team" component={Team} />
                                <ProtectedRoute
                                    path="/zoomLink"
                                    component={ZoomLink}
                                />
                                <ProtectedRoute
                                    path="/chatRoom"
                                    exact
                                    component={ChatRoom}
                                />
                                <ProtectedRoute
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
                                <ProtectedRoute
                                    path="/student-profile"
                                    component={StudentProfile}
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
                        </Suspense>
                    </div>
                </AnimatePresence>
            </Pages>
        </div>
    );
}

export default UserRoute;
