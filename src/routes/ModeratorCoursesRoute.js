import { lazy, Suspense } from 'react';
import MotionHoc from '../pages/moderator/MotionHoc';
import { Switch } from 'react-router-dom';
import Courses from '../pages/moderator/Courses';
import ClassCourses from '../pages/moderator/ClassCourses';
import Units from '../pages/moderator/Units';
import Lessons from '../pages/moderator/Lessons';
import ProtectedRoute from '../components/moderator/protectedRoute.jsx';
import RequestLoader from '../components/RequestLoader.jsx';

const QuestionForm = lazy(() => import('../pages/moderator/QuestionForm'));
const Teacher = lazy(() => import('../pages/moderator/Teacher'));

const ModeratorCoursesRouteComponent = () => {
    return (
        <Suspense fallback={<div style={{marginTop: "100px"}}><RequestLoader width={160} height={160}/></div>}>
            <Switch>
                <ProtectedRoute
                    path="/moderator/courses/teachers/classCourses/chapters/exams"
                    exact
                    component={QuestionForm}
                />
                <ProtectedRoute
                    path="/moderator/courses/teachers/classCourses/chapters/lessons"
                    exact
                    component={Lessons}
                />
                <ProtectedRoute
                    path="/moderator/courses/teachers/classCourses/chapters"
                    exact
                    component={Units}
                />
                <ProtectedRoute
                    path="/moderator/courses/teachers/classCourses"
                    exact
                    component={ClassCourses}
                />
                <ProtectedRoute
                    path="/moderator/courses/teachers"
                    exact
                    component={Teacher}
                />
                <ProtectedRoute
                    path="/moderator/courses"
                    exact
                    component={Courses}
                />
            </Switch>
        </Suspense>
    );
};

const ModeratorCoursesRoute = MotionHoc(ModeratorCoursesRouteComponent);

export default ModeratorCoursesRoute;
