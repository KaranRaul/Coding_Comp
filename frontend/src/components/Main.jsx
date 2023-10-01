import { useEffect, useState } from 'react';
// import './tempComp.css';
import Editor from "@monaco-editor/react";
import Axios from 'axios';
import { Navbar, Nav, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import UserCard from './UserCard';
import Modal from 'react-bootstrap/Modal'; // Import Bootstrap modal component

// import './userCard.css';
import "./styles.css";
import { Alert, CircularProgress } from '@mui/material';
const Main = () => {
    const [time, setTime] = useState(2000);
    const [alert, setAlert] = useState(false);
    const [msg, setMsg] = useState();
    let roomId = localStorage.getItem('roomId');
    const [userCode, setUserCode] = useState(``);
    const [userInput, setUserInput] = useState("");
    const [userOutput, setUserOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUserCode, setSelectedUserCode] = useState('');
    const [selectedUserOutput, setSelectedUserOutput] = useState('');
    const [editorOptions, setEditorOptions] = useState({
        autoIndent: 'full',
        contextmenu: true,
        fontFamily: 'monospace',
        fontSize: 13,
        lineHeight: 24,
        hideCursorInOverviewRuler: true,
        matchBrackets: 'always',
        minimap: {
            enabled: true,
        },
        scrollbar: {
            horizontalSliderSize: 4,
            verticalSliderSize: 18,
        },
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        language: "cpp"
    });

    const [allUsers, setAllusers] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const getUsers = await Axios.post('https://coding-comp-backend.vercel.app/api/getUserDetails', { roomId });
                if (getUsers.data)
                    setAllusers(getUsers.data);

            } catch (error) {

            }
        }
        const intervalId = setInterval(getUsers, 2000);
        console.log(allUsers);
        return () => clearInterval(intervalId);
    }, []);

    const runCode = async () => {
        setLoading(true);
        try {
            const data = {
                code: userCode,
                lang: editorOptions.language,
                input: userInput,
                isSolved: false
            }
            const response = await Axios.post('https://coding-comp-backend.vercel.app/api/submitCode', data,
                {
                    headers: {
                        roomid: localStorage.getItem('roomId'),
                        email: localStorage.getItem('email')
                    }
                });
            console.log(response);
            if (response.data.codeSubmit) {
                setLoading(false);
                setUserOutput(response.data.codeSubmit.output);


            }
        } catch (error) {

        }
    }
    function clearOutput() {
        setUserOutput("");
    }
    function compile() {
        setUserOutput("");
    }
    const handleOpenCode = (code) => {
        if (!code) {
            setAlert(true);
            setMsg("code not available");
            return;
        }
        setSelectedUserCode(code);
    };

    const handleOpenOutput = (code) => {
        if (!code) {
            setAlert(true);
            setMsg("output not available");
            return;
        }
        setSelectedUserOutput(code);
    };

    if (alert) {
        setTimeout(() => {
            setAlert(false)
            setTime(2000);
        }, time)
    }
    // useEffect(() => {

    //     setInterval(() => {
    //         setTime(15000);
    //         setMsg("THE SITE IS STILL UNDER CONSTRUCTION && WAIT FOR THE DELAY CAUSE THE SITE IS USING FREE API'S")
    //         setAlert(true);
    //     }, 60000);

    // }, [])
    const [text, setText] = useState('coding comp');
    const targets = ['etition', '.iler'];
    const delay = 200; // Adjust the delay between adding/removing characters as needed

    useEffect(() => {
        let phaseIndex = 0;
        let currentIndex = 0;
        let isAdding = true;
        let interval;

        const updateText = () => {
            const targetText = targets[phaseIndex];

            if (isAdding) {
                if (currentIndex < targetText.length - 1) {
                    setText((prevText) => prevText + targetText[currentIndex]);
                    currentIndex++;
                } else {
                    isAdding = false; // Start removing characters
                    currentIndex = targetText.length - 2;
                }
            } else {
                if (currentIndex >= 0) {
                    setText((prevText) => prevText.slice(0, -1));
                    currentIndex--;
                } else {
                    isAdding = true; // Start adding characters again
                    currentIndex = 0;
                    phaseIndex = (phaseIndex + 1) % targets.length; // Switch to the next phase
                }
            }

            interval = setTimeout(updateText, delay);
        };

        updateText();

        return () => clearTimeout(interval);
    }, []);
    if (userCode != '')
        localStorage.setItem('code', userCode)


    return (
        <div className="App">
            {alert && <Alert severity="warning"> {msg}</Alert>}
            {/* Bootstrap Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light ">
                <div className="text-transition-overlay">
                    <a className="navbar-brand text-transition-content">{text}</a>
                </div>

                <div className="collapse navbar-collapse mr-3 flex-class" id="navbarNav"
                    style={{ marginLeft: "250px" }}>
                    <ul className="navbar-nav mr-3">
                        <li className="nav-item mr-3"> {/* Add margin-right class */}
                            {/* Font Size Selector */}
                            <select
                                className="form-control"
                                onChange={(e) => setEditorOptions({ ...editorOptions, fontSize: parseInt(e.target.value) })}
                            >
                                <option value={8}>Font Size 8</option>
                                <option value={10}>Font Size 10</option>
                                <option value={12}>Font Size 12</option>
                                <option value={14}>Font Size 14</option>
                                <option value={16}>Font Size 16</option>
                                <option value={18}>Font Size 18</option>
                                <option value={20}>Font Size 20</option>
                            </select>
                        </li>
                        <li className="nav-item mr-3 flex-class"> {/* Add margin-right class */}
                            {/* Language Selector */}
                            <select
                                className="form-control"
                                onChange={(e) => setEditorOptions({ ...editorOptions, language: e.target.value })}
                            >
                                <option value="cpp">Cpp</option>
                                <option value="c">C</option>
                                <option value="java">Java</option>
                                <option value="python3">Python 3</option>
                                <option value="javascript">JavaScript</option>
                                <option value="php">PHP</option>
                                <option value="swift">Swift</option>
                                <option value="rust">RUST</option>
                                <option value="csharp">c#</option>
                                <option value="nodejs">NodeJS</option>
                                <option value="rust">RUST</option>



                                {/* Add other languages here */}
                            </select>
                        </li>
                        <li className="nav-item mr-3 flex-class"> {/* Add margin-right class */}
                            {/* Theme Selector */}
                            <select
                                className="form-control"
                                onChange={(e) => setEditorOptions({ ...editorOptions, theme: e.target.value })}
                            >
                                <option value="vs-dark">Dark Theme</option>
                                <option value="light">Light Theme</option>
                                {/* Add other themes here */}
                            </select>
                        </li>
                    </ul>
                    <button className="btn btn-success mr-3 flex-class-btn" onClick={runCode}>Run</button>
                    <ul className='room-id-bar'>
                        ROOM ID: {localStorage.getItem("roomId")}
                    </ul>
                </div>
            </nav>



            <div className='container1'>
                <div className="main">
                    <div className="left-container">
                        <Editor
                            // language="python"
                            language={editorOptions.language}
                            theme="vs-dark"
                            value={localStorage.getItem('code')}
                            onChange={setUserCode}
                            options={editorOptions}
                        />

                    </div>
                    <div className="right-container">
                        <h4>Input:</h4>
                        <div className="input-box">
                            <textarea
                                id="code-inp"
                                onChange={(e) => setUserInput(e.target.value)}
                            ></textarea>
                        </div>
                        <h4>Output:</h4>
                        {loading ? (
                            <div className="spinner-box">
                                {/* Add loading spinner here */}
                                <CircularProgress sx={{
                                    marginLeft: '145px',
                                    marginTop: "65px"
                                }} />
                            </div>
                        ) : (
                            <div className="output-box">
                                <pre>{userOutput}</pre>
                                <button onClick={clearOutput} className="clear-btn">
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='card-comp rounded-div'>
                    {loading ? (
                        <div>Loading...</div>
                    ) : allUsers ? (
                        allUsers.map((user, index) => (
                            <div key={index}>
                                <UserCard
                                    username={user.email}
                                    hasRunCode={user.isSolved}
                                    // Pass the user's code to the handleOpenCode function
                                    openCode={() => handleOpenCode(user.userCode)}
                                    openOutput={() => handleOpenOutput(user.userOutput)}
                                />
                            </div>
                        ))
                    ) : (
                        <div>No users to display</div>
                    )}
                </div>

                {/* Bootstrap Modal */}
                <Modal show={!!selectedUserCode} onHide={() => setSelectedUserCode('')}>
                    <Modal.Header closeButton>
                        <Modal.Title>User Code</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre>{selectedUserCode}</pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedUserCode('')}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={!!selectedUserOutput} onHide={() => setSelectedUserOutput('')}>
                    <Modal.Header closeButton>
                        <Modal.Title>User Output</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre>{selectedUserOutput}</pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedUserOutput('')}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Main;
