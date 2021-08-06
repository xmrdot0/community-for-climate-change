const express = require('express')
const app = express()
const port = 3001;
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const db = require("./util/database");
const passport = require('passport')

const bodyParser = require("body-parser");


const userRouter = require("./routes/user");
const eventRouter = require("./routes/event");
const initPassport = require("./util/passport-config");
initPassport(passport);

const User = require("./models/user");
const Event = require("./models/event");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(
    session({
        secret: "MySecret",
        store: new SequelizeStore({
            db: db,
        }),
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        proxy: true, // if you do SSL outside of node.
    })
);


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


app.use(eventRouter);
app.use(userRouter);



Event.belongsTo(User);
User.hasMany(Event);



// Implement in case there is time for displating participents
// Event.hasMany(User);
// User.belongsTo(Event)

db.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    })
    .catch((err) => console.log(err));