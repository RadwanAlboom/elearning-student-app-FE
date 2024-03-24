import { io } from 'socket.io-client';

let backendURL = process.env.REACT_APP_API_URL;

export const socketMsg = io(backendURL);
