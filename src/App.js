import React from 'react';
import UserSideBar from './UserSideBar';
import ChatBar from './ChatBar'

import socketIOClient from 'socket.io-client';
import { ENDPOINT } from './data/config.json';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.name = prompt("Enter Name: ");

        // Create websocket that connects to server
        this.socket = socketIOClient(ENDPOINT);
        this.socket.on('connect', () => {
            this.socket.emit("info", {name: this.name});
        });

        // Get user list from server
        this.socket.on('usersArray', data => {
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
        });

        this.state = {
            users: [
                {
                    id: 0,
                    name: "Thomas",
                    status: "online",
                    image: "http://simpleicon.com/wp-content/uploads/user1.png",
                    messages: [],
                },
            ],
            open_chat: null,
        };
    }

    setOpenChat = (id) => {
        this.setState({open_chat: id});
    }

    addMessage = (text, type) => {
        let users = this.state.users;
        users.filter(user => user.id === this.state.open_chat)[0].messages.push({text: text, type: type});
        this.setState(users);

        // Only send a message if it's an out message
        if (type === 'out') {
            this.socket.emit('sendMessage', {id: this.state.open_chat, messageText: text});
        }
    }

    setUsers = (users) => {
        this.setState({users: users});
    }

    render() {
        const open_chat_user = this.state.open_chat !== null ? this.state.users.filter(user => user.id === this.state.open_chat) : null;
        
        return (
            <div className='pannel'>
                <UserSideBar users={this.state.users} setOpenChat={this.setOpenChat} />
                <ChatBar open_chat_user={open_chat_user} setOpenChat={this.setOpenChat} addMessage={this.addMessage} />
            </div>
        );
    }
}