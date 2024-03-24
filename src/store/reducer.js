import { combineReducers } from 'redux';
import userNotificationsReducer from './userNotifications';
import entitiesReducer from './entities';
import requestsReducer from './requests';
import messagesReducer from './messages';
import msgNotificationsReducer from './msgNotifications';
import profileReducer from './profile';
import studentsReducer from './students';
import teachersReducer from './instructor';
import chatsReducer from './chatCord';

export default combineReducers({
    entities: entitiesReducer,
    userNotifications: userNotificationsReducer,
    requests: requestsReducer,
    messages: messagesReducer,
    msgNotifications: msgNotificationsReducer,
    profile: profileReducer,
    students: studentsReducer,
    teachers: teachersReducer,
    chats: chatsReducer,
});
