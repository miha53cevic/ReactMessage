import React from 'react';

export default class UserSideBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            searchText: ''
        };
    }

    onChange = (event) => {
        this.setState({searchText: event.target.value});
    };

    render() {
        // Filter out only the users 
        const users = this.props.users.filter(user => user.name.toLowerCase().includes(this.state.searchText));

        return (
            <div className='userSideBar'>
                <div className='searchBarDiv'>
                    <SearchBar onChange={this.onChange}/>
                </div>
                <div className='usersDiv'>
                    {users.map((item, i) => (
                        <User user={item} openChatWindow={this.props.setLastChat} key={item.id}/>
                    ))}
                </div>
                
            </div>
        );
    }
}

class SearchBar extends React.Component {
    render() {
        return (
            <input onChange={this.props.onChange} type='text' placeholder='Search...'></input>
        );
    }
}

class User extends React.Component {

    render() {
        const user = this.props.user;
        const statusColor = user.status === 'online' ? 'lime' : 'gray';  

        return (
            <div className='userDiv' onClick={() => this.props.openChatWindow(user.id)}>
                <img src={user.image} alt={'user_image'}></img>
                <div>
                    <p>{user.name}</p>
                    <p style={{color: statusColor}}>{user.status}</p>
                </div>
            </div>
        ); 
    }
}