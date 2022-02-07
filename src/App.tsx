import React from 'react';
import { useState } from 'react';
import UserSideBar from './UserSideBar';
import ChatBar from './ChatBar'

import socketIOClient from 'socket.io-client';

export interface IMessage {
    type: "out" | "in",
    text: string
};

export interface IUser {
    id: number,
    name: string,
    status: "online" | "offline",
    image: string,
    messages: IMessage[],
};

function App() {

    //const name = prompt("Enter Name: ");

    // Create websocket that connects to server
    /*const socket = socketIOClient(process.env.REACT_APP_API);
    socket.on('connect', () => {
        socket.emit("info", { name: name });
    });

    // Get user list from server
    socket.on('usersArray', data => {
        // Remove own instance of user
        const users = data.filter(user => user.id !== this.socket.id);

        // Remove open_window if the user we were talking to left
        if (!users.filter(user => user.id === this.state.open_chat).length) {
            this.setOpenChat(null);
        }

        this.setUsers(users);
    });

    // Handle receiving messages
    this.socket.on('receiveMessage', data => {
        this.setOpenChat(data.id);
        this.addMessage(data.messageText, 'in');
    });*/

    const startUsers: IUser[] = [
        {
            id: 0,
            messages: [],
            image: "http://simpleicon.com/wp-content/uploads/user1.png",
            name: "Bob",
            status: 'online',
        },
        {
            id: 1,
            messages: [],
            image: "http://simpleicon.com/wp-content/uploads/user1.png",
            name: "Marko",
            status: 'offline',
        },
    ];

    const [users, setUsers] = useState<Array<IUser> | null>(startUsers);
    const [openChatUser, setOpenChatUser] = useState<IUser | null>(null);

    const addMessage = (msg: IMessage) => {
        if (users === null || openChatUser === null) return;

        users.filter(user => user.id === openChatUser.id)[0].messages.push(msg);
        
        // Copy old array, inace neće jer ne kuži da se promjenilo nekaj unutar array-a on gleda samo objekta vanjskog, a ne unutarnje elemente
        setUsers([...users]);
        // Only send a message if it's an out message
        /*if (msg.type === 'out') {
            socket.emit('sendMessage', { id: this.state.open_chat, messageText: text });
        }*/
    }

    const openChat = (user: IUser) => {
        setOpenChatUser(user);
    };

    const closeChat = () => {
        setOpenChatUser(null);
    };

    return (
        <div className='pannel'>
            <UserSideBar users={users} openChat={openChat} />
            <ChatBar openChatUser={openChatUser} closeChat={closeChat} addMessage={addMessage} />
        </div>
    );
}

export default App;