import React from 'react';

// Used for generating unique keys
import shortid from 'shortid';

export default class ChatBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: []
        };
    }

    addMessage = (text, type) => {
        let messages = this.state.messages.slice();
        messages.push({text: text, type: type});
        this.setState({messages: messages});
    };

    render() {
        const open_chat_user = this.props.open_chat_user;
        let drawOpenChat = open_chat_user !== null ? true : false;
        
        // Check for invalid last_chat id
        if (drawOpenChat && !open_chat_user.length) {
            console.error("Chat window with desired ID does not exist!");
            drawOpenChat = false;
        }

        // Only draw if there is an id and if it's correct
        if (drawOpenChat) {

            return (
                <div className='chatBar'>
                    <TopBar open_chat_user={open_chat_user} closeWindow={this.props.setOpenChat}/>
                    <MessagesField messages={this.state.messages}/>
                    <TextField addMessage={this.addMessage} />
                </div>
            );

        } else return (
            <div className='chatBar'></div>
        );
    }
}

class TopBar extends React.Component {
    render() {
        const open_chat_user = this.props.open_chat_user[0];

        return (
            <div className="topBarDiv">
                <img src={open_chat_user.image} alt="user_image"></img>
                <h1>{open_chat_user.name}</h1>
                <button onClick={() => this.props.closeWindow(null)}>Exit</button>
            </div>
        );
    }
}

class MessagesField extends React.Component {
    render() {
        return (
            <div className="messagesDiv">
                {this.props.messages.map((element, index) =>
                    <Message message={element} key={shortid.generate()}/>
                )}
            </div>
        );
    }
}

class TextField extends React.Component {
    onSubmit = (event) => {
        event.preventDefault();
        this.props.addMessage(event.target.messageText.value, 'out');
    };
    
    render() {
        return (
            <form className='textFieldDiv' onSubmit={this.onSubmit}>
                <input name='messageText' type='text'></input>
                <button type='submit'>Send</button>
            </form>
        );
    }
}

class Message extends React.Component {

    render() {
        const message = this.props.message;

        let messageType;
        if (message.type === 'out') {
            messageType = 'outMessageDiv';
        } else if (message.type === 'in') {
            messageType = 'inMessageDiv';
        }
        return (
            <div className={messageType}>
                <p>{message.text}</p>
            </div>
        );
    }
}