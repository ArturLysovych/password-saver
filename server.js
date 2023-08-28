const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.static(__dirname + '/public'));

mongoose.connect(`mongodb+srv://arturlisovic:${process.env.DB_PASSWORD}@cluster0.00e1aai.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(error => {
    console.error('Error connecting to MongoDB:', error);
});

const passwordSchema = new mongoose.Schema({
    login: String,
    password: String
});
const Password = mongoose.model('password', passwordSchema);

const password = new Password({ login: '123', password: '123' });
password.save();

app.listen(PORT, () => {
    console.log(`Server works on PORT: ${PORT}`);
});