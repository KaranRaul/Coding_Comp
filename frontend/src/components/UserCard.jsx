import React from 'react';
import "./styles.css";
import { Button } from '@mui/material';
const UserCard = ({ username, hasRunCode, hasSolved, openCode, openOutput }) => {
    const runCodeIconClass = hasRunCode ? 'text-success' : 'text-danger';

    // Define a CSS class to handle the border color and width based on hasSolved
    const cardBorderStyle = hasSolved
        ? 'border-success border-3' // Use 'border-3' for a thicker border
        : 'border-danger border-3';  // Use 'border-3' for a thicker border

    return (
        <div className={`card rounded `}>
            <div className="car-body">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="user-card-header">
                        <h5>{username}</h5>
                    </div>
                    <div className="user-card-body">
                        <div className="d-flex flex-column align-items-end">
                            <Button variant='outlined' size='small' onClick={openCode}>
                                Open Code
                            </Button>
                            <Button variant='outlined' size='small' onClick={openOutput}>
                                Open Output
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default UserCard;
