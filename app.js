const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');


app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config({ path: './config.env' });


// Initialize DB

// mongoose.set('strictQuery', false);
// database connection with mongoose
// mongoose
// .connect('mongodb://mongo:27017/registrationlogin',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('connection successful'))
// .catch(err => console.log(`no connection`))


mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Successfully connected to the database ");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Error...", err);
    process.exit();
  });


const User = require('./model/userSchema');


// for understand the json format
app.use(express.json())

// Serve CSS files with the correct MIME type
app.use(express.static('public', { 
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// we link the router files to make our route easy

app.use(require('./router/auth'));

const port = process.env.PORT;



app.listen(port,() => {
   console.log(`server is running at port no ${port}`);
});