const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register');
const profile = require('./controllers/profile');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

const {DB_HOST, DB_USER, DB_PWD, DB_NAME} = process.env;
const {PORT} = process.env;

const db = knex({
  client: 'pg',
  connection: {
    host : DB_HOST,
    user : DB_USER,
    password : DB_PWD,
    database : DB_NAME
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());


db.select().from('users').then(console.log);

app.post('/signin',signin.handleSignIn(db,bcrypt));

app.post('/register',register.handleRegister(db,bcrypt));

app.get('/profile/:userid',profile.handleProfile(db));

app.put('/image',image.handleImage(db));

app.post('/imageAPI',image.handleImageAPI);

app.listen(PORT);
