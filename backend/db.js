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
        const mongoDB = "mongodb+srv://karanraul02:1deq9u8aLMlgtdmM@cluster0.u0sdmgg.mongodb.net/compiler";
        mongoose.connect(mongoDB);

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo