import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './styles.css';
import { Button } from '@mui/material';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
function CreateRoom() {
    let navigate = useNavigate();
    const [roomId, setRoomId] = useState(localStorage.getItem('roomId'));
    const [users, setUsers] = useState([]);
    // The empty dependency array ensures that this effect runs only once


    useEffect(() => {
        // Define an asynchronous function to fetch users
        async function fetchUsers() {
            try {
                const response = await Axios.post('https://coding-comp-backend.vercel.app/api/getPlayers', { roomId });
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        console.log("req");

        // Call the fetchUsers function when the component mounts or when roomId changes
        // fetchUsers();
        const intervalId = setInterval(fetchUsers, 5000); // Fetch every 5 seconds (adjust as needed)

        // Cleanup: clear the interval when the component unmounts or when roomId changes
        return () => clearInterval(intervalId);
    }, []);

    const startRoom = async () => {
        try {
            let user = localStorage.getItem('email');
            const response = await Axios.post('https://coding-comp-backend.vercel.app/api/start', {}, {
                headers: {
                    user
                }
            });
            if (response.data.msg) {
                // window.location = '/main';
                navigate('/main');
            }
        } catch (error) {
        }
    }

    return (
        <>
            <div className='main-room'>
                <div className='room-id rounded-div'>
                    <h1>ROOM ID</h1>
                    <h1> {roomId}</h1>
                    <div className='button-start'>
                        <Button variant='contained' onClick={startRoom}>START</Button>
                    </div>
                </div>
                <div className='card-comp rounded-div'>
                    {users.map((user) => {
                        return <UserCard name={user} />
                    })}
                </div >

            </div>

        </>
    )
}

const UserCard = (props) => {

    return <div className="card rounded">
        <div className="card-body d-flex align-items-start">
            <div>
                {/* Add content you want to display to the left of the image */}
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOPJ5dTrQSe3mDwAx13Igby0nTFuGN6ovTyg&usqp=CAU"
                    alt="User"
                    className="rounded-circle user-image mr-3"
                    style={{ marginRight: '10px', width: '50px', height: '50px', background: 'transparent' }}
                />

            </div>
            <div>
                <h5 className="card-title">{props.name}</h5>
            </div>
        </div>

    </div >
}

export default CreateRoom

