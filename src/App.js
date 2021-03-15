import React from 'react';
import UserSideBar from './UserSideBar';
import ChatBar from './ChatBar'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [
                {
                    id: 0,
                    name: "Thomas",
                    status: "online",
                    image: "http://simpleicon.com/wp-content/uploads/user1.png"
                },
                {
                    id: 1,
                    name: "Peter",
                    status: "offline",
                    image: "http://simpleicon.com/wp-content/uploads/user1.png"
                },
                {
                    id: 2,
                    name: "Jeff",
                    status: "online",
                    image: "http://simpleicon.com/wp-content/uploads/user1.png"
                },
                {
                    id: 3,
                    name: "Charlie",
                    status: "online",
                    image: "http://simpleicon.com/wp-content/uploads/user1.png"
                },
                {
                    id: 4,
                    name: "Garnt",
                    status: "online",
                    image: "http://simpleicon.com/wp-content/uploads/user1.png"
                },
                {
                    id: 5,
                    name: "Connor",
                    status: "offline",
                    image: "http://simpleicon.com/wp-content/uploads/user1.png"
                },
            ],
            open_chat: 0,
        };
    }

    setOpenChat = (id) => {
        this.setState({open_chat: id});
    }

    render() {
        const open_chat_user = this.state.open_chat !== null ? this.state.users.filter(user => user.id === this.state.open_chat) : null;

        return (
            <div className='pannel'>
                <UserSideBar users={this.state.users} setOpenChat={this.setOpenChat} />
                <ChatBar open_chat_user={open_chat_user} setOpenChat={this.setOpenChat} />
            </div>
        );
    }
}