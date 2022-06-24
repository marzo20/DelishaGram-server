const db = require('./models')

// testing user CREATE
db.User.create({
		firstName: 'guest',
		lastName: 'guest',
		email: 'guest@guest.com',
		userName: "guest", 
		password: 'guest'	
	})
	.then(user => {
		console.log('what up test boi!!!', user)
	})
	.catch(console.warn)

db.Post.create({
		content: 'this sucks pp',
		rating: 5,
	})
	.then(post => {
		console.log('post created!!!', post)
	})
	.catch(console.warn)

// db.Restaurant.create({
// 		yelpRestaurantId: 'abcd12345',
// 		rating: 5,
// 	})
// 	.then(post => {
// 		console.log('post created!!!', post)
// 	})
// 	.catch(console.warn)