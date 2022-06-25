const router = require('express').Router()
const db =require('../../models')


// GET /posts -- READ a all posts

router.get('/', async (req, res)=> {
    try{
        // find all posts
        const posts = await db.Post.find({})
        // send to the client
        res.json(posts)
    }catch(err){
        res.status(500).json({ msg: 'server error'})
    }
})

// GET /posts/:id -- details on post
router.get('/:id', async (req, res) => {
    try{
        const post = await db.Post.findById(req.params.id)
        res.json(post)
    }catch(err){
        res.status(500).json({ msg: 'server error'})
    }
})

// POST /posts -- create posts
router.post('/', async (req, res) => {
    try {
        // FOR NOW, userId comes from req.body, FUTURE-> userId will come from token in localstorage
        const foundUser = await db.User.findOne({
            id: req.body.userId
        })

        // create new post every time
        const newPost = await db.Post.create({
            content: req.body.content,
            rating: req.body.rating
        })
        // find restaurant by name
        let newRestaurant = await db.Restaurant.findOne({
            name: req.body.restName
        })
        // if restaurant could not be found, create a new restaurant in db
        if (!newRestaurant) {
            newRestaurant = await db.Restaurant.create({
                name: req.body.name  
            })
        }
        // find dish by name
        let newDish = await db.Dish.findOne({
            dishName: req.body.dish
        })
        // if dish could not be found, create a new dish in db
        if(!newDish) {
            newDish = await db.Dish.create({
                dishName: req.body.dish
            })
        }

        // push new post into dish 
        newDish.posts.push(newPost)
        newDish.restaurant = newRestaurant
        newDish.save()

        // set dish reference in post 
        newPost.dish = newDish
        newPost.poster = foundUser
        newPost.save()

        // push new post into created reference in user
        foundUser.created.push(newPost)
        foundUser.save()

        // push newdish into restaurant 
        newRestaurant.dishes.push(newDish)
        newRestaurant.save()
        
        res.status(201).json(foundPost)
    }catch(err){
        console.log('post error',err)
        if (err.name === "ValidationError"){
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error'})
    }
})

router.put('/:id', async (req, res)=>{
    try{
        // get id from the url params
        const id = req.params.id
        // search for the id in the db. and update using the req.body
        const options = {new:true }
        const updatedPost = await db.Post.findByIdAndUpdate(id, req.body, options)
        // send the updated post to client
        res.json(updatedPost)
    }catch(err){
        console.log('post error',err)
        if (err.name === "ValidationError"){
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error'})
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
    }catch(err){
        console.log('delete error',err)
        if (err.name === "ValidationError"){
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error'})
    }
})

module.exports = router