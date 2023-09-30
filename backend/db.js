const mongoose = require('mongoose');


// const connectToMongo = () => {

//     try {
//         const dbUri = "mongodb://localhost:27017/compiler"
//         mongoose.connect(dbUri);

//     } catch (error) {
//         console.log(error);
//     }

// }

// module.exports = connectToMongo;


const connectToMongo = () => {
    try {
        const mongoDB = "mongodb://127.0.0.1/compiler";
        mongoose.connect(mongoDB);

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo