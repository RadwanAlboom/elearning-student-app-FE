import { lazy, Suspense } from 'react';
import { Switch, useLocation, Redirect } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

import ProtectedRoute from '../components/admin/protectedRoute';
import Sidebar from '../components/admin/Sidebar';
import '../components/style.css';
import RequestLoader from '../components/RequestLoader';

const ZoomLink = lazy(() => import('../pages/admin/ZoomLink'));
const StudentUnit = lazy(() => import('../pages/admin/StudentUnit'));
const Requests = lazy(() => import('../pages/admin/Requests'));
const Review = lazy(() => import('../pages/admin/Review'));
const Exams = lazy(() => import('../pages/admin/Exams'));
const AdminCoursesRoute = lazy(() => import('./AdminCoursesRoute'));
const Students = lazy(() => import('../pages/admin/Students'));
const DeviceInfo = lazy(() => import('../pages/admin/DeviceInfo'));
const PaymentActions = lazy(() => import('../pages/admin/PaymentActions'));
const Teachers = lazy(() => import('./../pages/admin/Teachers'));
const Profile = lazy(() => import('../pages/admin/Profile'));

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
                        <Suspense fallback={<div style={{marginTop: "100px"}}><RequestLoader width={160} height={160}/></div>}>
                            <Switch location={location} key={location.pathname}>
                                <ProtectedRoute
                                    path="/admin/zoomLink"
                                    component={ZoomLink}
                                />
                                <ProtectedRoute
                                    path="/admin/studentUnit"
                                    component={StudentUnit}
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
                                    path="/admin/device-info"
                                    component={DeviceInfo}
                                />
                                <ProtectedRoute
                                    path="/admin/payment-actions"
                                    component={PaymentActions}
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
                        </Suspense>
                    </div>
                </AnimatePresence>
            </Pages>
        </>
    );
}

export default AdminRoute;
