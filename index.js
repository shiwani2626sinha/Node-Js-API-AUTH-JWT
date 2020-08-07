const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT= 5000;


dotenv.config(); // access everything the dot env file

const authRoute = require('./router/auth');

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useCreateIndex: true}
, () => console.log('connected to db!'));

app.use(express.json());


app.use('/api/user/',authRoute);

app.listen(PORT, () => {
    console.log("Server up and running");
});