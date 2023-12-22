// import { io } from 'socket.io-client'

// export const socket = io(import.meta.env.VITE_DOMAIN)

// export const socketRunTest = io(import.meta.VITE_RUN_SOCKET)

import { io } from 'socket.io-client';

// Use environment variables with more descriptive names
const DOMAIN_SOCKET_URL = import.meta.env.VITE_DOMAIN;
const RUN_TEST_SOCKET_URL = import.meta.env.VITE_RUN_SOCKET;

// Create socket instances
export const socket = io(DOMAIN_SOCKET_URL);
export const runTestSocket = io(RUN_TEST_SOCKET_URL);

// Optional: Add error handling for the sockets
socket.on('connect_error', (error) => {
  console.error('Domain Socket Connection Error:', error);
});

runTestSocket.on('connect_error', (error) => {
  console.error('Run Test Socket Connection Error:', error);
})