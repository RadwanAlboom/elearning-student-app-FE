import MotionHoc from '../pages/admin/MotionHoc';
import { Switch } from 'react-router-dom';
import Courses from '../pages/admin/Courses';
import ClassCourses from '../pages/admin/ClassCourses';
import Units from '../pages/admin/Units';
import Lessons from '../pages/admin/Lessons';
import Teacher from '../pages/admin/Teacher';
import ProtectedRoute from '../components/admin/protectedRoute.jsx';
import QuestionForm from '../pages/admin/QuestionForm';
const AdminCoursesRouteComponent = () => {
    return (
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
    );
};

const AdminCoursesRoute = MotionHoc(AdminCoursesRouteComponent);

export default AdminCoursesRoute;
