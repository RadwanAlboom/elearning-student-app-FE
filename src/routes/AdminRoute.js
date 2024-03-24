import { Switch, useLocation, Redirect } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

import ProtectedRoute from '../components/admin/protectedRoute';
import Sidebar from '../components/admin/Sidebar';
import Profile from '../pages/admin/Profile';
import Requests from '../pages/admin/Requests';
import Exams from '../pages/admin/Exams';
import Review from '../pages/admin/Review';
import AdminCoursesRoute from './AdminCoursesRoute';
import Students from '../pages/admin/Students';
import Teachers from './../pages/admin/Teachers';
import ZoomLink from '../pages/admin/ZoomLink';
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

function AdminRoute() {
    const location = useLocation();
    return (
        <>
            <Sidebar />
            <Pages className="routes-no-padding">
                <AnimatePresence exitBeforeEnter>
                    <div style={{ width: '100%' }}>
                        <Switch location={location} key={location.pathname}>
                            <ProtectedRoute
                                path="/admin/zoomLink"
                                component={ZoomLink}
                            />
                            <ProtectedRoute
                                path="/admin/requests"
                                component={Requests}
                            />
                            <ProtectedRoute
                                path="/admin/exams/review"
                                component={Review}
                            />
                            <ProtectedRoute
                                path="/admin/exams"
                                component={Exams}
                            />
                            <ProtectedRoute
                                path="/admin/courses"
                                component={AdminCoursesRoute}
                            />
                            <ProtectedRoute
                                path="/admin/students"
                                component={Students}
                            />

                            <ProtectedRoute
                                path="/admin/teachers"
                                component={Teachers}
                            />
                            <ProtectedRoute
                                path="/admin/profile"
                                component={Profile}
                            />
                            <Redirect from="/admin" exact to="/admin/profile" />
                        </Switch>
                    </div>
                </AnimatePresence>
            </Pages>
        </>
    );
}

export default AdminRoute;
