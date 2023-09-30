const express = require('express')
const { User, Room, Question } = require('../models/index.js');
const router = express.Router();
const { connections } = require('mongoose');
const Axios = require('axios');
const { createServer } = require('node:http');
const { join } = require('node:path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
//tests

router.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});
// io.on('connection', (socket) => {
//     console.log('a user connected');
// });




//ROUTE 1: POST create new user >> 
router.post('/createUser', async (req, res) => {
    try {
        console.log("req rec");
        let user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            return res.json({ msg: "LOGGED IN", user })
        }
        // else {
        //create new user
        user = await User.create({
            email: req.body.email
        });
        //save user

        const savedUser = await user.save();
        res.json({ msg: "LOGGED IN", savedUser })
        // }

    }
    catch (error) {
        res.status(500).json({ error, err: "EROOR OCUURED" })
    }
});


//ROUTE 2: create Room

router.post('/createRoom', async (req, res) => {
    //verify user
    try {
        console.log(req.headers);
        let user = await User.findOne({ email: req.headers.user });
        if (!user)
            return res.json({ err: "LOGIN TO CREATE ROOM" });

        //generate id first
        const roomId = Math.ceil(Math.random() * 10000);
        // console.log(roomId);
        const exist = await Room.findOne({ players: user });
        if (exist) {
            return res.json({ err: "YOU ARE ALEADY JOINED ANOTHER ROOM" });
        }
        const room = await Room.create({
            roomKey: roomId,
            players: [user],
            codeSubmit: [{ user }]
        });
        await room.save();

        io.emit('roomCreated', { msg: 'room is creted ', room });

        res.send({ msg: "room is created", room });

    } catch (error) {
        res.send(error);
    }
});

//ROUTE 2.2 EXIT FROM ROOM 
router.post('/exitRoom', async function (req, res) {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        if (!user)
            return res.json({ msg: "LOGIN  FIRST" });

        const room = await Room.findOne({ players: user });
        if (!room) {
            return res.json({ msg: "YOU HAVENT JOINED ANY ROOM" });
        }

        // await Room.findOneAndUpdate(
        //     { _id: room._id },
        //     { $pull: { players: user._id } },
        //     { new: true }
        // );
        await Room.findOneAndUpdate(
            { _id: room._id },
            {
                $pull: {
                    players: user._id,
                    codeSubmit: { user: user._id } // Remove the object with matching user field
                }
            },
            { new: true }
        );




        res.json({ msg: "User removed from the room successfully" });


    } catch (error) {
        console.log(error);

    }
})


//ROUTE 3: TO JOIN PLAYERS 
router.put('/joinRoom', async (req, res) => {

    try {
        const roomId = req.body.roomId;

        let user = await User.findOne({ email: req.headers.user });
        if (!user)
            return res.status(401).send("LOGIN TO JOIN ROOM");


        //check if room exists
        const room = await Room.findOne({ roomKey: roomId });
        if (!room) {
            return res.json({ err: "Does NOT Exists any Room with Id " + roomId })
        }

        const exist = await Room.findOne({ players: user });
        if (exist) {
            return res.json({ err: "YOU ARE ALEADY JOINED ANOTHER ROOM" });
        }
        // const result = await Room.updateOne(
        //     { roomKey: roomId },
        //     { $push: { players: user } },
        //     { $push: { codeSubmit: user } });
        room.players.push(user);

        // Add the user to the codeSubmit subdocument of the room
        room.codeSubmit.push({ user });
        const final = await room.save();
        if (final) {
            return res.send(final);
        }

        if (result) {
            io.to(roomId).emit('userJoinedRoom', { msg: 'Successfully join To Room ' })
            res.json({ msg: "Successfully Join To Room" });
        }


    } catch (error) {
        res.send(error);
    }

})



//ROUTE 4: GET ALL ROOM PLAYERS
router.post('/getPlayers', async (req, res) => {
    try {
        const room = await Room.findOne({ roomKey: req.body.roomId });

        if (!room) {
            return res.status(401).json({ msg: "Does NOT Exists any Room with Id " + roomId })
        }


        let users = await Room.findOne({ roomKey: req.body.roomId });

        const ids = users.players;

        const userEmails = async () => {
            const emailPromise = ids.map(async (id) => {
                const user = await User.findOne({ _id: id });
                return user.email;
            })

            return Promise.all(emailPromise);
        }

        const names = await userEmails();
        res.send(names);


    }

    catch (error) {
        return res.json(error);
    }
});


//ROUTE 5: Add Question

router.post('/addQuestion', async (req, res) => {

    try {
        const { question, input, code } = req.body;

        //udaate real output for the code
        const result = await getOutput(code, "cpp");
        const finalResult = result.data.output;
        const newQ = await Question.create({
            question,
            input,
            output: finalResult
        });
        if (newQ) {
            return res.send(newQ);
        }

    } catch (error) {
        return res.json(error);
    }
});

//ROUTE 6 Start Games::::
router.post('/start', async (req, res) => {
    try {
        const userName = req.headers.user;
        const isQuestion = req.body.isQuestion;
        console.log(userName);
        const user = await User.findOne({ email: userName });
        if (!user)
            return res.status(401).send("LOGIN TO START ROOM");

        const room = await Room.findOne({ players: user });
        // console.log(room);
        if (!room)
            return res.status(401).send("CERATE ROOM FIRST TO START ROOM");


        //find room key
        const roomKey = room.roomKey;
        console.log(roomKey);
        if (!isQuestion) {
            room.isQuestion = false;
            await room.save();
            res.json({ msg: "ROOM STARTED" });
        }
        else {
            room.isQuestion = true;
            //PICK QUESTION
            const QuestionId = await Question.findOne();
            console.log(QuestionId);
            const addQuestion = await Room.updateOne({ roomKey: roomKey },
                { $set: { question: QuestionId } });

            if (addQuestion) {
                return res.send(addQuestion);
            }
        }

    } catch (error) {

    }
});
router.post('/runTest', async (req, res) => {
    try {
        console.log("run test")
        const JdoodleResult = await getOutput(req.body.code, req.body.lang);
        const output = JdoodleResult.data.output;

        res.send({ output });

    } catch (error) {
        res.send(error)
    }
});

const getOutput = async (code, lang, input) => {
    try {
        let data = ({
            script: code,
            clientId: "e4f697dcc19bbd14f50170bafb277c80",
            clientSecret: "a6978f18a25ac114d6b39666b74a320aea9f354612e269abec77ce68552c7967",
            stdin: input,
            language: lang,
            versionIndex: "0"

        });

        const result = await Axios.post('https://api.jdoodle.com/v1/execute',
            JSON.stringify(data),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        // console.log(result);
        return (result);

    } catch (error) {
        console.log(error);
    }

};
//ROUTE TEST s

//ROUTE 7: SUMBIT CODE
router.post('/submitCode', async (req, res) => {
    const { roomid, email } = req.headers;
    const { code, lang, isSolved, input } = req.body;
    const user = await User.findOne({ email });

    try {
        // Make the API call to Jdoodle
        const JdoodleResult = await getOutput(code, lang, input);
        const output = JdoodleResult.data.output;

        const room = await Room.findOne({ roomKey: roomid });

        if (!room) {
            return res.json({ msg: "Room not found" });
        }
        console.log("User:", user);

        // Debugging: Check the codeSubmit array
        console.log("CodeSubmit:", room.codeSubmit);

        const codeSubmit = room.codeSubmit.find(entry => entry.user.equals(user._id));

        if (!codeSubmit) {
            return res.json({ msg: "Code submit entry not found for the user" });
        }

        // Update the code and output
        codeSubmit.code = code;
        codeSubmit.output = output;
        codeSubmit.isSolved = isSolved;
        if (!room.isQuestion) {
            await room.save();
            return res.json({ msg: "code saved successfully", codeSubmit })
        }
        const question = await Question.findOne({ _id: room.question });
        await room.save();

        // Save the updated room document

        if (checkResult(output, question.output))
            return res.json({ msg: "Code SAVED successfully && RIGHT OUTPUT", output, op: question.output, })
        // //after check if user will the game by ckecking output
        // else
        return res.json({ msg: "Code SAVED successfully" }, output, question.output);


    } catch (error) {
        res.json(error);
    }
});

//ROUTE 8 TO GET USER DETAILS
router.post('/getUserDetails', async (req, res) => {
    try {

        const { roomId } = req.body;
        const room = await Room.findOne({ roomKey: roomId });
        if (!room) {
            return res.json({ msg: "Room not found" });
        }
        // Debugging: Check the codeSubmit array
        // console.log("CodeSubmit:", room.codeSubmit);
        if (!room.codeSubmit) {
            return res.json({ err: "code submit entry not found" });
        }
        const userInfos = await Promise.all(
            room.codeSubmit.map(async (entry) => {
                const userId = entry.user;
                const user = await User.findOne({ _id: userId });

                if (!user) {
                    return null; // Handle the case where the user is not found
                }

                const code = entry.code;
                const output = entry.output;
                const isSolved = entry.isSolved != null ? entry.isSolved : false;


                return {
                    email: user.email,
                    userCode: code,
                    userOutput: output,
                    isSolved,
                };
            }));
        return res.json(userInfos);
    } catch (error) {
        return res.json({ error });
    }
})



const checkResult = (output, questionOp) => {
    const finalOp = output.split(' ').join('').split('\n').join('');
    const finalQue = questionOp.split(' ').join('').split('\n').join('');

    return finalOp === finalQue;
}




module.exports = router;