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
            last_chat: 0,
        };
    }

    setLastChat = (id) => {
        this.setState({last_chat: id});
    }

    render() {
        const last_chat = this.state.last_chat !== null ? this.state.users.filter(user => user.id === this.state.last_chat) : null;

        return (
            <div className='pannel'>
                <UserSideBar users={this.state.users} setLastChat={this.setLastChat} />
                <ChatBar last_chat_user={last_chat} setLastChat={this.setLastChat} />
            </div>
        );
    }
}