import { combineReducers } from 'redux';
import adminCoursesReducer from './adminCourses';
import teachersReducer from './teachers';
import teamReducer from './team';
import classCoursesReducer from './classCourses';
import unitsReducer from './units';
import usersUnitReducer from './usersUnit';
import lessonsReducer from './lessons';
import examsReducer from './exams';
import filesReducer from './files';
import zoomReducer from './zoom';

export default combineReducers({
    adminCourses: adminCoursesReducer,
    teachers: teachersReducer,
    team: teamReducer,
    classCourses: classCoursesReducer,
    units: unitsReducer,
    usersUnit: usersUnitReducer,
    lessons: lessonsReducer,
    exams: examsReducer,
    files: filesReducer,
    zoom: zoomReducer,
});
