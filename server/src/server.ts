import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { PORT } from '../data/config.json';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true
    }
});

app.use(cors({origin: true}));
app.get('/', (req, res) => {
    res.send(`<h1>Running on: ${port}</h1>`);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

interface IMessage {
    type: 'out' | 'in',
    text: string,
};

interface IUser {
    id: string,
    name: string,
    status: 'online' | 'offline',
    image: string,
    messages: IMessage[],
};

let users: IUser[] = [];
io.on('connect', socket => {

    socket.on('info', (data: { name: string }) => {
        const user: IUser = {
            id: socket.id,
            name: data.name,
            status: "online",
            image: "http://simpleicon.com/wp-content/uploads/user1.png",
            messages: [],
        };
        users.push(user);
        console.log(`A user has connected, current users: ${users.length}`);

        // Send the new user list to every user
        io.emit('usersArray', users);
    });

    socket.on('disconnect', () => {
        // Take every user except the one that just left
        users = users.filter(user => user.id !== socket.id);
        console.log(`A user has disconnected, current users: ${users.length}`);
        // Update user list
        io.emit('usersArray', users);
    });

    // Route message
    socket.on('sendMessage', (data: { id: string, msg: IMessage }) => {
        // Find the id to which to send the message to
        const id = users.filter(user => user.id === data.id)[0].id;
        // Change the message from type: 'out' to type 'in'
        const message: IMessage = { type: 'in', text: data.msg.text };
        // Send message
        io.to(id).emit('receiveMessage', { id: socket.id, msg: message });
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT === undefined ? PORT : process.env.PORT;
server.listen(port, () => {
    console.log(`Running on port ${port}`);
});