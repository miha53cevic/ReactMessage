import React from 'react';
import { useState } from 'react';
import UserSideBar from './UserSideBar';
import ChatBar from './ChatBar';

import useSocketIO, { IUser, IMessage } from './useSocketIO';

function App() {
    
    const [openChatUser, setOpenChatUser] = useState<IUser | null>(null);
    const { Socket, users, setUsers } = useSocketIO();

    const addMessage = (msg: IMessage) => {
        if (users === null || openChatUser === null) return;

        setUsers((users) => {
            if (users == null) return users;
            users.filter(user => user.id === openChatUser.id)[0].messages.push(msg);
            return [...users];
        });

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

    React.useEffect(() => {
        // close chat if the openChatUser has left
        if (openChatUser != null && users != null) {
            if (!users.some(user => user.id === openChatUser.id)) {
                closeChat();
            }
        }
    }, [users, openChatUser]);

    return (
        <div className='pannel'>
            <UserSideBar users={users} openChat={openChat} />
            <ChatBar openChatUser={openChatUser} closeChat={closeChat} addMessage={addMessage} />
        </div>
    );
}

export default App;