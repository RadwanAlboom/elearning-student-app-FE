import MotionHoc from '../pages/moderator/MotionHoc';
import { Switch } from 'react-router-dom';
import Courses from '../pages/moderator/Courses';
import ClassCourses from '../pages/moderator/ClassCourses';
import Units from '../pages/moderator/Units';
import Lessons from '../pages/moderator/Lessons';
import Teacher from '../pages/moderator/Teacher';
import QuestionForm from '../pages/moderator/QuestionForm';
import ProtectedRoute from '../components/moderator/protectedRoute.jsx';

const ModeratorCoursesRouteComponent = () => {
    return (
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
    );
};

const ModeratorCoursesRoute = MotionHoc(ModeratorCoursesRouteComponent);

export default ModeratorCoursesRoute;
