import React, { useEffect, useRef, useState } from 'react';
import shortid from 'shortid';

import { IMessage, IUser } from './useSocketIO';

///////////////////////////////////////////////////////////////////////////////

interface ChatBarProps {
    openChatUser: IUser | null,
    closeChat: () => void,
    addMessage: (msg: IMessage) => void,
}

function ChatBar({ openChatUser, closeChat, addMessage }: ChatBarProps) {

    if (openChatUser) {
        
        return (
            <div className='chatBar'>
                <TopBar openChatUser={openChatUser} closeChat={closeChat} />
                <MessagesField messages={openChatUser.messages} />
                <TextField addMessage={addMessage} />
            </div>
        );

    } else return (
        <div className='chatBar'></div>
    );
};

export default ChatBar;

///////////////////////////////////////////////////////////////////////////////

interface TopBarProps {
    openChatUser: IUser,
    closeChat: () => void,
};

function TopBar({ openChatUser, closeChat }: TopBarProps) {

    return (
        <div className="topBarDiv">
            <img src={openChatUser.image} alt="user_image"></img>
            <h1>{openChatUser.name}</h1>
            <button onClick={() => closeChat()}>Exit</button>
        </div>
    );
}


///////////////////////////////////////////////////////////////////////////////

interface MessagesFieldProps {
    messages: IMessage[]
};

function MessagesField({ messages }: MessagesFieldProps) {

    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        // Scroll to bottom of messages
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return (
        <div className="messagesDiv">
            {messages.map((element, index) =>
                <Message msg={element} key={shortid.generate()} />
            )}
            <div ref={messagesEndRef}></div>
        </div>
    );
}

///////////////////////////////////////////////////////////////////////////////

interface TextFieldProps {
    addMessage: (msg: IMessage) => void,
};

function TextField({ addMessage }: TextFieldProps) {

    const [text, setText] = useState<string>("");

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setText(e.target.value);
    };

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        addMessage({ text: text, type: 'out' });

        // Clear input box
        setText("");
    };

    return (
        <form className='textFieldDiv' onSubmit={onSubmit}>
            <input onChange={onChange} value={text} type='text'></input>
            <button type='submit'>Send</button>
        </form>
    );
}

///////////////////////////////////////////////////////////////////////////////

interface MessageProps {
    msg: IMessage,
};

function Message({ msg }: MessageProps) {

    let messageType;
    if (msg.type === 'out') {
        messageType = 'outMessageDiv';
    } else if (msg.type === 'in') {
        messageType = 'inMessageDiv';
    }
    return (
        <div className={messageType}>
            <p>{msg.text}</p>
        </div>
    );
}