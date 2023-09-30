import React, { useState } from 'react'
import { Alert, Button, } from '@mui/material'
import Axios from 'axios';
import "../index.css"
import createMixins from '@mui/material/styles/createMixins';
import { useNavigate } from 'react-router-dom';
function HomePage() {
    let navigate = useNavigate();
    const [roomId, setRoomId] = useState();
    const [flag, setFlag] = useState(false);
    const [msg, setMsg] = useState();
    // This code will run only once when the component is initially mounted
    const createRoom = async () => {
        try {
            const data = await Axios.post('https://coding-comp-backend.vercel.app/api/createRoom', {},
                {
                    headers: {
                        "user": localStorage.getItem('email')
                    }
                });

            if (data.data.err) {
                setFlag(true);
                console.log(data.response)
                setMsg(data.data.err);

            }
            else {
                localStorage.setItem('roomId', data.data.room.roomKey);
                // window.location = '/main';
                navigate('/main');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const joinRoom = async () => {
        // try {
        // console.log(localStorage.getItem('email'));
        const response = await Axios.put('https://coding-comp-backend.vercel.app/api/joinRoom', { roomId },
            {
                headers: {
                    'user': localStorage.getItem('email')
                }
            });
        console.log(response);
        if (response.data.err) {
            setFlag(true);
            setMsg(response.data.err);
        }
        else {
            localStorage.setItem('roomId', roomId);
            // window.location = '/main'
            navigate('/main');
        }

        // } catch (error) {
        //     console.log(error);
        // }
    }

    const exitRoom = async () => {
        try {
            const response = await Axios.post('https://coding-comp-backend.vercel.app/api/exitRoom', { email: localStorage.getItem('email') });
            if (response.data) {
                setFlag(true);
                setMsg(response.data.msg);
            }
        } catch (error) {

        }
    }

    return (
        <div>
            {flag && <Alert sx={{ zIndex: 10, position: 'relative' }} severity="warning">{msg}</Alert>}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '15vh' }}>
                <Button variant='contained' onClick={exitRoom}>EXIT FROM ROOM</Button>
            </div>
            <div className='home-container'>
                <Button
                    variant="contained" class="home-button .flex-itemH " onClick={() => { createRoom(); }}>CREATE ROOM </Button>

                <Button
                    variant="contained" type="button" class="home-button btn btn-primary " data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">JOIN ROOM </Button>
            </div>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">JOIN ROOM</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label for="recipient-name" class="col-form-label">ROOM ID</label>
                                    <input type="text" class="form-control" id="recipient-name" onChange={(e) => { setRoomId(e.target.value) }} />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={() => {
                                try {
                                    joinRoom();
                                } catch (error) {

                                }
                            }}>ENTER</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default HomePage
