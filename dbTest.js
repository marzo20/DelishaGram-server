const db = require('./models')


const testFunction = async () => {
	try {
		// testing user CREATE
		const createdUser = await db.User.create({
			firstName: 'guest',
			lastName: 'guest',
			email: 'guest@guest.com',
			userName: "guest",
			password: 'guest'
		})


		// testing post create	
		const createdPost = await db.Post.create({
			content: 'this sucks pp',
			rating: 5,
		})


		// testing restaurant create
		const createdRest = await db.Restaurant.create({
			yelpRestaurantId: 'abcd12345',
			name: "breaking bad restaurant",
			address1: "1 yummy st",
			address2: "",
			address3: "",
			city: "yummyCity",
			zip_code: "123456",
			country: "USA",
			state: "CA",
			latitude: 0,
			longitude: 0,

		})


		// testing Dish create
		const createdDish = await db.Dish.create({
			dishName: 'mac and cheese pizza',

		})
			.then(dish => {
				console.log('dish created!!!', dish)
			})
			.catch(console.warn)

		console.log(createdUser)	
		// test adding post to user 
		// createdUser.created.push(createdPost)
		// createdPost.poster = createdUser
		// await createdUser.save()
		// await createdPost.save()

		// test adding dish to post

		// test adding dish to restaurant

		// test show user post and populate
	} catch (error) {
		console.warn(Error)
	}
}

testFunction()