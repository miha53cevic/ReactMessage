import React from 'react';
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

function useSocketIO() {
    const [Socket, setSocket] = React.useState<Socket | null>(null);
    const [users, setUsers] = React.useState<Array<IUser> | null>(null);

    React.useEffect(() => {
        const name = prompt('Enter name: ');

        // Create websocket that connects to server
        const api = process.env.REACT_APP_API || "";
        const socket = io(api);

        // Send initial joined info
        socket.on('connect', () => {
            socket.emit("info", { name: name });
        });


        // Get user list from server
        socket.on('usersArray', (data: IUser[]) => {
            // Remove own instance of user
            const newUsers = data.filter(user => user.id !== socket.id);
            // setUsers((users) => {...}) users je stari state pa dok vračaš ga možeš koristit npr [...users, noviElement ili array] itd...
            setUsers((users) => {
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
                    // mora biti [...array] jer je updatedArray pointer na users pa hocemo poslati kopiju da se state promjeni
                    return [...updatedUsers];
                } else return [...newUsers];    // isto saljemo kopiju da osiguram da je novi state dobar
            });

        });

        // Handle receiving messages
        socket.on('receiveMessage', (data: { id: string, msg: IMessage }) => {
            // Koristi unutar setUsers jer onda ne treba dodati dependencie
            setUsers((users) => {
                if (users == null) return users;

                // TODO - Add notification
                // Add Message
                users.filter(user => user.id === data.id)[0].messages.push(data.msg);
                return [...users];
            });
        });

        setSocket(socket);
    }, []);

    return {
        Socket,
        users,
        setUsers
    };
};

export default useSocketIO;