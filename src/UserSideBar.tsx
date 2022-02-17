import React from 'react';
import { useState } from 'react';
import shortid from 'shortid';

import { IUser } from './useSocketIO'

///////////////////////////////////////////////////////////////////////////////

interface SearchBarProps {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function SearchBar({ onChange }: SearchBarProps) {
    return (
        <input onChange={onChange} type='text' placeholder='Search...'></input>
    );
};

///////////////////////////////////////////////////////////////////////////////

interface UserProps {
    user: IUser,
    openChatWindow: (user: IUser) => void
};

function User({ user, openChatWindow }: UserProps) {

    const statusColor = user.status === 'online' ? 'lime' : 'gray';

    return (
        <div className='userDiv' onClick={() => openChatWindow(user)}>
            <img src={user.image} alt={'user_image'}></img>
            <div>
                <p>{user.name}</p>
                <p style={{ color: statusColor }}>{user.status}</p>
            </div>
        </div>
    );
};

///////////////////////////////////////////////////////////////////////////////

interface UserSideBarProps {
    users: IUser[] | null,
    openChat: (user: IUser) => void
};

function UserSideBar({ users, openChat }: UserSideBarProps) {
    
    const [searchText, setSearchText] = useState<string>("");
    const [usersFiltered, setUsersFiltered] = useState<IUser[] | undefined>(undefined);

    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchText(e.target.value);
    };

    // Filter out only the users 
    React.useEffect(() => {
        console.log(users);
        if (users == null) return;
        setUsersFiltered(users.filter(user => user.name.toLowerCase().includes(searchText)));
    }, [users, searchText]);


    return (
        <div className='userSideBar'>
            <div className='searchBarDiv'>
                <SearchBar onChange={onSearchChange} />
            </div>
            <div className='usersDiv'>
                {usersFiltered ? usersFiltered.map((item, i) =>
                    <User user={item} openChatWindow={openChat} key={shortid.generate()} />
                ): null}
            </div>

        </div>
    );
};

export default UserSideBar;
