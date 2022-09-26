const mongoose = require('mongoose');
const dotenv  =  require('dotenv').config();

class Database {

    connect = async () =>  {
        const connection = await mongoose.connect(`mongodb+srv://${ process.env.DB_USERNAME }:${ process.env.DB_PASSWORD }@${ process.env.DB_NAME }.qnhm6gn.mongodb.net/${ process.env.DB_COLLECTION }?retryWrites=true&w=majority`);
        connection
            ? console.log(`🔑 Database '${process.env.DB_NAME}' initialized successfully!`)
            : console.log(`🔥 Error: ${error.message}`);
    };

};

module.exports  = new Database();