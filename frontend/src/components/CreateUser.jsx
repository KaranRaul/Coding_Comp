import { Button, TextField, Typography, Alert } from '@mui/material'
import React, { useState } from 'react'
import { makeStyles } from '@mui/styles';
import Axios from 'axios';
const useStyles = makeStyles({
    root: {
        // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: "linear-gradient(90deg, rgba(8,172,235,1) 0%, rgba(63,190,220,1) 100%)",
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 55,
        padding: '0 30px',
        width: "320px",

        '&:hover': {
            transitionDelay: '5s',
            background: "linear-gradient(90deg, rgba(111,161,180,1) 6%, rgba(8,172,235,1) 21%, rgba(63,190,220,1) 85%, rgba(95,147,159,1) 100%)", // Change gradient on hover
        },
    },
    textField: {
        border: "linear-gradient(45deg, #A9DFBF 30%, #58D68D 90%)",
        // border: 'none',
        borderRadius: '3px',
        color: 'white',
        height: '48px',
        padding: '0 12px',
        marginBottom: '20px',
        width: "320px",

    },
    typography: {
        fontSize: '1.2rem', // Adjust the font size as needed
        fontWeight: 'bold', // Adjust the font weight as needed
        // Add margin as needed
    },
});
const createUser = () => {
    const classes = useStyles();
    const [alert, setAlert] = useState(false);
    const [msg, setMsg] = useState();
    const [user, setUser] = useState();
    const onSubmit = async () => {
        if (!user) {
            setMsg('PLEASE ENTER THE USERNAME');
            setAlert(true);
            return;
        }
        // let input = { email: user }
        const data = await Axios.post('https://coding-comp-backend.vercel.app/api/createUser', { email: user });
        if (data.data.err) {
            setMsg(data.data.err);
            setAlert(true);
            return;

        }
        else {
            console.log(data.data.err);
            setAlert(true);
            setMsg(data.data.msg);
        }
        if (data.data) {
            localStorage.setItem('email', user);
            window.location = '/homepage';
        }
    }
    return (
        <div>
            <div>
                {alert && <Alert severity="warning">{msg}</Alert>}
            </div>
            <div className="login-container">
                <Typography className="title" variant="h5">
                    ENTER YOUR USERNAME
                </Typography>
                <TextField
                    className="text-field"
                    onChange={(e) => setUser(e.target.value)}
                    label="Username"
                    variant="outlined"
                />
                <Button
                    className="button"
                    variant="contained"
                    onClick={onSubmit}
                >
                    ENTER
                </Button>
            </div>
        </div>
    );
};


const styles = {
    loginContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    },
    title: {
        marginBottom: '35px',
        marginTop: '35px',
    },
    textField: {
        marginBottom: '20px',
        width: '100%',
    },
    button: {
        backgroundColor: '#007bff',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#0056b3',
        },
    },
};
export default createUser
