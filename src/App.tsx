import React, { useEffect } from 'react';
import { useState } from 'react';
import UserSideBar from './UserSideBar';
import ChatBar from './ChatBar'

import io, { Socket } from 'socket.io-client';

export interface IMessage {
    type: "out" | "in",
    text: string
};

export interface IUser {
    id: string,
    name: string,
    status: "online" | "offline",
    image: string,
    messages: IMessage[],
};

function App() {

    const [Socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<Array<IUser> | null>(null);
    const [openChatUser, setOpenChatUser] = useState<IUser | null>(null);

    useEffect(() => {
        const name = prompt("Enter username:");

        // Create websocket that connects to server
        const api = process.env.REACT_APP_API || "";
        const socket = io(api);

        socket.on('connect', () => {
            socket.emit("info", { name: name });
        });

        setSocket(socket);

        // Setup starting dummy users
        /*const startUsers: IUser[] = [
            {
                id: "0",
                messages: [],
                image: "http://simpleicon.com/wp-content/uploads/user1.png",
                name: "Bob",
                status: 'online',
            },
            {
                id: "1",
                messages: [],
                image: "http://simpleicon.com/wp-content/uploads/user1.png",
                name: "Marko",
                status: 'offline',
            },
        ];*/
    }, []);

    useEffect(() => {
        if (!Socket) return;

        // Get user list from server
        Socket.on('usersArray', (data: IUser[]) => {
            // Remove own instance of user
            const newUsers = data.filter(user => user.id !== Socket.id);

            // Remove open_window if the user we were talking to leftđ
            if (openChatUser != null) {
                if (!newUsers.some(user => user.id === openChatUser.id)) {
                    closeChat();
                }
            }

            // Ako vec postoje users samo dodaj nove koji su došli
            if (users) {
                let updatedUsers = users;
                // Prvo provjeri ako su neki users otišli (disconnect)
                for (const i of users) {
                    if (!newUsers.some(user => user.id === i.id))
                        updatedUsers = users.filter(user => user.id !== i.id);
                };

                for (const i of newUsers) {
                    // Ako user ne postoji unutar users onda ga dodaj u users
                    if (!updatedUsers.some(user => user.id === i.id)) {
                        updatedUsers.push(i);
                    }
                };
                setUsers([...updatedUsers]);
            } else setUsers([...newUsers]);
        });

        // Handle receiving messages
        Socket.on('receiveMessage', (data: { id: string, msg: IMessage }) => {
            if (users === null) return;
            // TODO - Add notification
            // Add Message
            console.log(data);
            users.filter(user => user.id === data.id)[0].messages.push(data.msg);
            setUsers([...users]);
        });
    }, [Socket, users, openChatUser]);


    const addMessage = (msg: IMessage) => {
        if (users === null || openChatUser === null) return;

        users.filter(user => user.id === openChatUser.id)[0].messages.push(msg);

        // Copy old array, inace neće jer ne kuži da se promjenilo nekaj unutar array-a on gleda samo objekta vanjskog, a ne unutarnje elemente
        setUsers([...users]);

        // Only send a message if it's an out message
        if (msg.type === 'out' && Socket) {
            Socket.emit('sendMessage', { id: openChatUser.id, msg: msg });
        }
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