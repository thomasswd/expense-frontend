const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')

//load config
dotenv.config({ path: './config/config.env'}) //where all global variables are stored

//passport config
require('./config/passport')(passport);

connectDB()

//initialize app
const app = express()

// body parser
// allows you to access req.body, which is the content of the form being submitted
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.use(methodOverride(function (req, res) {
    if(req.body && typeof req.body ==='object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//handlebars
//adds middleware for handlebars
app.engine('.hbs', exphbs({ helpers: { formatDate, stripTags, truncate, editIcon, select }, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//sessions
//needs to be above the passport middleware
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false, //dont create a session until something is stored
    store: new MongoStore({ mongooseConnection: mongoose.connection})
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session()) 

//set global variables with middleware function 
app.use( (req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//set the routes of '/' from index
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
