const mongoose = require ('mongoose');

function connectDb () {
    try {
        mongoose.connect (process.env.DB_URL);
        console.log("Data Base Is Connected..!")
    }catch (err) {
        console.log('Data Base Note Connected..!')
    }
}
module.exports =connectDb;