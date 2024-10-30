import { lazy, Suspense } from 'react';
import MotionHoc from '../pages/user/MotionHoc';
import { Switch } from 'react-router-dom';
import Courses from '../pages/user/Courses';
import ClassCourses from '../pages/user/ClassCourses';
import Units from '../pages/user/Units';
import Lessons from '../pages/user/Lessons';
import ProtectedRoute from '../components/protectedRoute';
import RequestLoader from '../components/RequestLoader';

const QuestionForm = lazy(() => import('../pages/user/QuestionForm'));
const Teacher = lazy(() => import('../pages/user/Teacher'));

const UserCoursesRouteComponent = () => {
    return (
        <Suspense fallback={<div style={{marginTop: "100px"}}><RequestLoader width={160} height={160}/></div>}>
            <Switch>
                <ProtectedRoute
                    path="/courses/teachers/classCourses/chapters/exams"
                    exact
                    component={QuestionForm}
                />
                <ProtectedRoute
                    path="/courses/teachers/classCourses/chapters/lessons"
                    exact
                    component={Lessons}
                />
                <ProtectedRoute
                    path="/courses/teachers/classCourses/chapters"
                    exact
                    component={Units}
                />
                <ProtectedRoute
                    path="/courses/teachers/classCourses"
                    exact
                    component={ClassCourses}
                />
                <ProtectedRoute
                    path="/courses/teachers"
                    exact
                    component={Teacher}
                />
                <ProtectedRoute path="/courses" exact component={Courses} />
            </Switch>
        </Suspense>
    );
};

const UserCoursesRoute = MotionHoc(UserCoursesRouteComponent);

export default UserCoursesRoute;
