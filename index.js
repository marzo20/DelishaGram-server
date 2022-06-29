// required packages
require('dotenv').config()
require('./models') // connect to the db
const express = require('express')
const cors = require('cors')

// app config/middlewares
const app = express()
const PORT =  process.env.PORT || 8000
app.use(cors())
app.use(express.json()) //json req.bodies
// static upload folder for images
app.use(express.static('uploads')) 

// simple middleware
// app.use((req, res, next) => {
// 	console.log('hello i am a middleware')
// 	res.locals.myData = 'I am data that is passed out of the middleware'
// 	// tell express to move on to the next thing
// 	next()
// })

const myMiddleware = (req, res, next) => {
	console.log('hello i am a middleware')
	res.locals.myData = 'I am data that is passed out of the middleware'
	// tell express to move on to the next thing
	next()
}

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
  });

// routes and controllers
// route specific middlware
app.get('/', myMiddleware, (req, res) => {
	res.json({ msg: 'welcome to the backed! its good to be back ☠️' })
	console.log(res.locals.myData)
})

app.use('/api-v1/users', require('./controllers/api-v1/users'))
app.use('/api-v1/posts', require('./controllers/api-v1/posts'))
app.use('/api-v1/images', require('./controllers/api-v1/images'))
app.use('/api-v1/dishes', require('./controllers/api-v1/dishes'))
app.use('/api-v1/restaurants', require('./controllers/api-v1/restaurants'))

// listen on a port
app.listen(PORT, () => {
	console.log(`is the PORT ${PORT} that I hear? 🌽`)
})