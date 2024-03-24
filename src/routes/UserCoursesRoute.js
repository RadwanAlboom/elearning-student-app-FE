import MotionHoc from '../pages/user/MotionHoc';
import { Switch } from 'react-router-dom';
import Courses from '../pages/user/Courses';
import ClassCourses from '../pages/user/ClassCourses';
import Units from '../pages/user/Units';
import Lessons from '../pages/user/Lessons';
import ProtectedRoute from '../components/protectedRoute';
import Teacher from '../pages/user/Teacher';
import QuestionForm from '../pages/user/QuestionForm';

const UserCoursesRouteComponent = () => {
    return (
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
    );
};

const UserCoursesRoute = MotionHoc(UserCoursesRouteComponent);

export default UserCoursesRoute;
