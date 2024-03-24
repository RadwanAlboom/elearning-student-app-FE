import { combineReducers } from 'redux';
import adminCoursesReducer from './adminCourses';
import teachersReducer from './teachers';
import classCoursesReducer from './classCourses';
import unitsReducer from './units';
import lessonsReducer from './lessons';
import examsReducer from './exams';
import filesReducer from './files';
import zoomReducer from './zoom';

export default combineReducers({
    adminCourses: adminCoursesReducer,
    teachers: teachersReducer,
    classCourses: classCoursesReducer,
    units: unitsReducer,
    lessons: lessonsReducer,
    exams: examsReducer,
    files: filesReducer,
    zoom: zoomReducer,
});
