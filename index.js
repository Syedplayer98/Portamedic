const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const adminRoute = require('./Routes/admin');
const agentRoute = require('./Routes/agent');
const caseRoute = require('./Routes/case');
const session = require('express-session');
const bodyParser=require("body-parser");
const MongoStore = require('connect-mongo')(session);
const  compression = require('compression');
dotenv.config();

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECT,
{
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => console.log('DB Connected!')).catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
});


app.use(express.json());
app.use(compression());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set("view engine","ejs");
app.use(express.static("./views"));
app.use(session({
    name : process.env.Cookie_Name,
    resave : false,
    secret: process.env.Cookie_Secret,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
     maxAge: 1000 * 60 * 60 * 3,
     sameSite: true,
     secure: false
    }
}))

app.use(adminRoute);
app.use(agentRoute);
app.use(caseRoute);

const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`Server Up and Running at Port ${port}`));