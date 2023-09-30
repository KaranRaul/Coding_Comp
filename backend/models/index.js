const mongoose = require('mongoose');

/* USER */
const userSchema = mongoose.Schema({
    email: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
/* ROOM */
const roomSchema = mongoose.Schema({
    roomKey: { type: Number, required: true, unique: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isQuestion: { type: Boolean },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    codeSubmit: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isSolved: { type: Boolean },
        code: { type: String },
        output: { type: String },
    }]
})

const Room = mongoose.model("Room", roomSchema);

/* QUESTIONS */
const questionSchema = mongoose.Schema({
    question: { type: String, required: true },
    input: { type: String, require: true },
    output: { type: String, require: true }
});

const Question = mongoose.model("Question", questionSchema);


module.exports = { User, Room, Question };