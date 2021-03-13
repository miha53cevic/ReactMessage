import React from 'react';

export default class ChatBar extends React.Component {

    render() {
        const last_chat_user = this.props.last_chat_user;
        let drawLastChat = last_chat_user !== null ? true : false;
        
        // Check for invalid last_chat id
        if (drawLastChat && !last_chat_user.length) {
            console.error("Chat window with desired ID does not exist!");
            drawLastChat = false;
        }

        // Only draw if there is an id and if it's correct
        if (drawLastChat) {

            return (
                <div className='chatBar'>
                    <TopBar last_chat_user={last_chat_user} closeWindow={this.props.setLastChat}/>
                    <MessagesField />
                    <TextField />
                </div>
            );

        } else return (
            <div className='chatBar'></div>
        );
    }
}

class TopBar extends React.Component {
    render() {
        const last_chat = this.props.last_chat_user[0];

        return (
            <div className="topBarDiv">
                <img src={last_chat.image} alt="user_image"></img>
                <h1>{last_chat.name}</h1>
                <button onClick={() => this.props.closeWindow(null)}>Exit</button>
            </div>
        );
    }
}

class MessagesField extends React.Component {
    render() {
        return (
            <div className="messagesDiv">
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
                <h1>MesagesField</h1>
            </div>
        );
    }
}

class TextField extends React.Component {
    render() {
        return (
            <div className='textFieldDiv'>
                <input type='text'></input>
                <button>Send</button>
            </div>
        );
    }
}