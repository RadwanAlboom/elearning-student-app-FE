import { lazy, Suspense } from 'react';
import MotionHoc from '../pages/admin/MotionHoc';
import { Switch } from 'react-router-dom';
import Courses from '../pages/admin/Courses';
import ClassCourses from '../pages/admin/ClassCourses';
import Units from '../pages/admin/Units';
import Lessons from '../pages/admin/Lessons';
import ProtectedRoute from '../components/admin/protectedRoute.jsx';
import RequestLoader from '../components/RequestLoader.jsx';

const QuestionForm = lazy(() => import('../pages/admin/QuestionForm'));
const Teacher = lazy(() => import('../pages/admin/Teacher'));

const AdminCoursesRouteComponent = () => {
    return (
        <Suspense fallback={<div style={{marginTop: "100px"}}><RequestLoader width={160} height={160}/></div>}>
            <Switch>
                <ProtectedRoute
                    path="/admin/courses/teachers/classCourses/chapters/exams"
                    exact
                    component={QuestionForm}
                />
                <ProtectedRoute
                    path="/admin/courses/teachers/classCourses/chapters/lessons"
                    exact
                    component={Lessons}
                />
                <ProtectedRoute
                    path="/admin/courses/teachers/classCourses/chapters"
                    exact
                    component={Units}
                />
                <ProtectedRoute
                    path="/admin/courses/teachers/classCourses"
                    exact
                    component={ClassCourses}
                />
                <ProtectedRoute
                    path="/admin/courses/teachers"
                    exact
                    component={Teacher}
                />
                <ProtectedRoute path="/admin/courses" exact component={Courses} />
            </Switch>
        </Suspense>
    );
};

const AdminCoursesRoute = MotionHoc(AdminCoursesRouteComponent);

export default AdminCoursesRoute;
