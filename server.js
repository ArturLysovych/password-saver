const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
let myAccount = { };
let accountLogCheck = false;
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(`mongodb+srv://arturlisovic:${process.env.DB_PASSWORD}@cluster0.srzuej3.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    login: String,
    password: String
});

const User = mongoose.model('user', userSchema);

const passwordSchema = new mongoose.Schema({
    appName: String,
    appLogin: String,
    appPassword: String,
    appEmail: String,
    accountLogin: String
});
const Password = mongoose.model('password', passwordSchema);

app.post('/reg-submit', async (req, res) => {
    try {
        const login = req.body.login;
        const password = req.body.password;
        const user = new User({ login, password });
        await user.save();
        
        console.log('User saved successfully');
        res.status(200).send('User saved successfully');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Error saving user');
    }
});
app.post('/add-password', async (req, res) => {
    try {
        const appName = req.body.appName;
        const appLogin = req.body.appLogin;
        const appPassword = req.body.appPassword;
        const appEmail = req.body.appEmail;
        const accountLogin = req.body.accountLogin;

        const password = new Password({ appName, appLogin, appPassword, appEmail, accountLogin })
        await password.save();
        
        console.log('Password saved successfully');
        res.status(200).send('Passwors saved successfully');
    } catch (error) {
        console.error('Error saving password:', error);
        res.status(500).send('Error saving password');
    }
}); 
app.get('/get-userinfo', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(500).send('Error getting user info');
    }
});
app.get('/account', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.post('/log-submit', async (req, res) => {
    try {
        myAccount = req.body;
        const user = await db.collection('users').findOne({ login: req.body.login });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});
app.post('/delete-passwords', async (req, res) => {
    let nameToDelete = req.body.delArr;
    let userLogin = req.body.myAccount.login;
    try {
        for (let el of nameToDelete) {
            const result = await db.collection('passwords').deleteMany({ appName: el });
        }
        res.json(db.collection('users').findOne({ login: userLogin }));
    } catch (error) {
        console.error(`Error during deletion: ${error}`);
        res.status(500).send('Помилка під час видалення.');
    }
});

app.post('/get-passwordsinfo', async (req, res) => {
    try {
        const passwords = await Password.find({ accountLogin: myAccount.login });
        res.json(passwords);
    } catch (error) {
        console.error('Error getting password info:', error);
        res.status(500).send('Error getting password info');
    }
});
app.get('/set-myaccount', (req, res) => {
    res.json(myAccount);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/404/index.html'));
});
http.listen(PORT, () => {
    console.log(`Server work on PORT: ${PORT}`);
});