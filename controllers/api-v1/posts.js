const router = require('express').Router()
const db = require('../../models')
// const jwt = require('jsonwebtoken')


// GET /posts -- READ a all posts

router.get('/', async (req, res) => {
    try {
        // find all posts
        const posts = await db.Post.find({}).populate([{
            path:"dish",
            populate:{
                path:"restaurant",
            },
        },{path:"poster"}])
        // send to the client
        console.log(posts)

        res.json(posts)
    } catch (err) {
        res.status(500).json({ msg: 'server error' })
    }
})

// GET /posts/:id -- details on post
router.get('/:id', async (req, res) => {
    try {
        const post = await db.Post.findById(req.params.id)
        res.json(post)
    } catch (err) {
        res.status(500).json({ msg: 'server error' })
    }
})

// POST /posts -- create a new post
router.post('/', async (req, res) => {
    try {
        // // jwt from the client sent in the headers
        // const authHeader = req.headers.authorization
        // console.log(req.headers.authorization)
        // // decode the jwt -- will throw to the catch if the signature is invalid
        // const decode = jwt.verify(authHeader, process.env.JWT_SECRET)
        // // find the user in the db that sent the jwt
        // const foundUser = await db.User.findById(decode.id)
        // // mount the user on the res.locals, so the downstream route has the logged in user
        // res.locals.user = foundUser
        // console.log(foundUser)

        // Find Current User by email via req.body
        const foundUser = await db.User.findOne({
            email: req.body.email
        })
        console.log("foundUser", foundUser)

        // create new post every time
        const newPost = await db.Post.create({
            restaurant: req.body.restaurant,
            content: req.body.content,
            rating: req.body.rating
        })
        console.log(newPost)
        console.log("req.body:", req.body)
        // find restaurant by name
        let newRestaurant = await db.Restaurant.findOne({
            name: req.body.restaurant
        })
        // if restaurant could not be found, create a new restaurant in db
        if (!newRestaurant) {
            newRestaurant = await db.Restaurant.create({
                name: req.body.restaurant
            })
        }
        console.log("newRestaurant", newRestaurant)
        // find dish by name
        let newDish = await db.Dish.findOne({
            dishName: req.body.dish
        })
        // if dish could not be found, create a new dish in db
        if (!newDish) {
            newDish = await db.Dish.create({
                dishName: req.body.dish
            })
        }
        console.log("newDish", newDish)

        // push new post into created reference in user
        foundUser.created.push(newPost)
        await foundUser.save()

        // push new post into dish 
        newDish.posts.push(newPost)
        newDish.restaurant = newRestaurant
        await newDish.save()

        // set dish reference in post 
        newPost.dish = newDish
        newPost.poster = foundUser
        await newPost.save()



        // push newdish into restaurant 
        const dishAlreadyInRest = newRestaurant.dishes.includes(newDish._id)
        console.log("dishAlreadyInRest T/F", dishAlreadyInRest)
        if (!dishAlreadyInRest) {
            newRestaurant.dishes.push(newDish)
            await newRestaurant.save()
        }


        console.log("newPost:", newPost)
        res.status(201).json({newPost})
    } catch (err) {
        console.log('post error', err)
        if (err.name === "ValidationError") {
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        // get id from the url params
        const id = req.params.id
        // search for the id in the db. and update using the req.body
        const options = { new: true }
        const updatedPost = await db.Post.findByIdAndUpdate(id, req.body, options)
        // send the updated post to client
        res.json(updatedPost)
    } catch (err) {
        console.log('post error', err)
        if (err.name === "ValidationError") {
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error' })
    }
})

// DELETE /posts/:id --delete posts

router.delete('/:id', async (req, res) => {
    try {
        // get the id from params
        const id = req.params.id
        // delete that post in the db
        await db.Post.findByIdAndDelete(id)
        // send 'no content' status
        res.sendStatus(204) //was successful -- nothing exists
    } catch (err) {
        console.log('delete error', err)
        if (err.name === "ValidationError") {
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error' })
    }
})

module.exports = router