const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

// POST /users/register -- CREATE a new user
router.post('/register', async (req, res) => {
	try {
		// check if the user exists already
		const findUser = await db.User.findOne({
			email: req.body.email,
			userName: req.body.userName
		})

		// disallow users from registering twice
		if (findUser) {
			// stop the route and send a response saying the user exists
			return res.status(400).json({ msg: 'email exists already 🤦‍♂️' })
		}

		// hash the user's password
		const password = req.body.password
		const saltRounds = 12
		const hashedPassword = await bcrypt.hash(password, saltRounds)

		// create a new user with the hashed password
		const newUser = new db.User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			userName: req.body.userName,
			email: req.body.email,
			password: hashedPassword
		})
		await newUser.save()

		// sign the user in by sending a valid jwt back
		// create the jwt payload
		const payload = {
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			userName: newUser.userName,
			email: newUser.email,
			id: newUser.id
		}
		// sign the token and send it back
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }) // expires in one day
		res.json({ token })
	} catch (err) {
		console.warn(err)
		// handle validation errors
		if (err.name === "ValidationError") {
			res.status(400).json({ msg: err.message })
		} else {
			// handle all other errors
			res.status(500).json({ msg: 'server error 500' })
		}
	}
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
	try {
		// all the data will come in on the req.body
		// try to find the user in the database
		const foundUser = await db.User.findOne({
			email: req.body.email
		})
		const noLoginMessage = 'Incorrect email or password.'

		// if the user is not found, return send a status of 400 let the user know login failed
		if (!foundUser) {
			console.log('incorrect email', req.body)
			return res.status(400).json({ msg: noLoginMessage })
		}

		// check if the supplied password matches the hash in the db
		const passwordCheck = await bcrypt.compare(req.body.password, foundUser.password)
		// if they do not match, return and let the user know that login has failed
		if (!passwordCheck) {
			console.log('incorrect password', req.body)
			return res.status(400).json({ msg: noLoginMessage })
		}

		// create a jwt payload
		const payload = {
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			userName: foundUser.userName,
			email: foundUser.email,
			id: foundUser.id
		}
		// sign the jwt and send it back
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })

		res.json({ token })
	} catch (err) {
		// don't forget to handle your errors
		console.warn(err)
		res.status(500).json({ msg: 'Server room is on fire 🔥' })
	}

})

// get users based on search term for username
router.get("/search/:searchUser", async (req,res)=>{
	try {
		const allUsers = await db.User.find({}, "userName")
		const filteredUsers = allUsers.filter((user)=>{
			return user.userName.toLowerCase().includes(req.params.searchUser.toLowerCase())
		})
		if (filteredUsers.length > 0) {
			res.status(200).json(filteredUsers)
		} else {
			res.status(204).json(filteredUsers)
		}
		console.log(filteredUsers)
	} catch (error) {
		console.warn(error)
	}
})

//get user profile details
router.get("/profile/:userName", async (req, res) => {
	try {
		console.log("req.params:",req.params)
		const foundUser = await db.User.findOne({
			userName: req.params.userName
		}).populate([{
			path: "created",
			populate: [{
				path: "dish",
				populate: {
					path: "restaurant"
				}
			}, { path: "image" }]
		}, { path: "following", select: "userName" }, { path: "following", select: "userName" }])
		console.log("foundUser:", foundUser)
		const sendUser = {
			id: foundUser.id,
			email: foundUser.email,
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			userName: foundUser.userName,
			posts: foundUser.created,
			image: foundUser.created.image,
			following: foundUser.following,
			followers: foundUser.followers
		}
		console.log("foundUser:",sendUser)
		res.status(200).json(sendUser)
	} catch (error) {
		console.warn(error)
		res.status(500).json({ msg: 'server error' })
	}
})


// PUT /users/profile -- updates user's profile details
router.put('/profile/:id', async (req, res) => {
	try {
		const userId = {
			_id: req.params.id
		}
		// console.log(foundUser)
		// search for the id in the db, and update using the req.body
		const options = { new: true } // return the updated bounty to us
		const updatedProfile = await db.User.findOneAndUpdate(userId, req.body, options)
		console.log("updatedProfile: ", updatedProfile)
		res.status(200).json(updatedProfile)
	} catch (err) {
		console.warn(err)
		res.status(500).json({ msg: 'server error' })
	}
})

// PUT /users/changepassword -- updates user password
router.put("/changepassword", async (req, res) => {
	try {
		const foundUser = await db.User.findById(req.body.userId)

		// check if the supplied password matches the hash in the db
		const passwordCheck = bcrypt.compare(req.body.currentPassword, foundUser.password)
		// if they do not match, return and let the user know that login has failed
		if (!passwordCheck) {
			console.log('incorrect password', req.body.currentPassword)
			return res.status(400).json({ msg: "Incorrect Current Password" })
		} else {
			const saltRounds = 12
			const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds)
			foundUser.password = hashedPassword
			await foundUser.save()
			return res.status(200).json({ msg: "Password was updated" })
		}
	} catch (error) {
		console.warn(error)
		res.status(500).json({ msg: "Opps, something went wrong" })
	}
})


// GET /users/auth-locked -- checks users credentials and only send back privlaged information if the user is logged in properly
router.get('/auth-locked', authLockedRoute, (req, res) => {
	console.log('current user is:', res.locals.user)
	res.json({ msg: 'welcome to the secret auth-locked route 👋' })
})

router.post("/follow", async (req, res) => {
	try {
		// get currentUserId and userToFollowId from req.body
		console.log(req.body)
		// find both users
		const foundCurrentUser = await db.User.findById(req.body.currentUserId)
		const foundUserToFollow = await db.User.findById(req.body.userToFollowId)
		// check to see if the user is already following

		// if not, push 
		foundUserToFollow.followers.push(foundCurrentUser)
		await foundUserToFollow.save()

		foundCurrentUser.following.push(foundUserToFollow)
		await foundCurrentUser.save()

		res.status(200).json({ msg: "success!" })
	} catch (error) {
		console.warn(error)
	}
})

// route to unfollow user
router.delete("/unfollow", async (req, res) => {
	try {
		// get currentUserId and userToUnfollowId from req.body
		console.log(req.body)
		// find both users
		const foundCurrentUser = await db.User.findById(req.body.currentUserId)
		const foundUserToUnfollow = await db.User.findById(req.body.userToUnfollowId)

		// find user within pop user from arrays
		const unfollowersIdx = foundUserToUnfollow.followers.indexOf(foundCurrentUser.id)
		// console.log(unfollowersId)
		foundUserToUnfollow.followers.splice(unfollowersIdx,1)
		await foundUserToUnfollow.save()

		const unfollowingIdx = foundCurrentUser.following.indexOf(foundUserToUnfollow.id)
		foundCurrentUser.following.splice(unfollowingIdx,1)
		await foundCurrentUser.save()

		res.status(200).json({ msg: "success!" })
	} catch (error) {
		console.warn(error)
	}
})


module.exports = router